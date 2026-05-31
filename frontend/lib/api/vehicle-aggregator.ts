import { queryDataGov } from "./data-gov";
import { RESOURCES } from "./data-gov-resources";
import type {
  MainRecord,
  ExtendedRecord,
  TechnicalRecord,
  OwnershipRecord,
  RecallRecord,
  ModelSpecRecord,
  PriceRecord,
  PersonalImportRecord,
} from "./data-gov";
import type { Vehicle, Owner, Recall, SafetyFeatures } from "../types";
import { calculateRisk } from "../risk-calculator";
import { toneFromScore, labelFromTone } from "../risk";
import { getManufacturerSlug } from "../manufacturer-logos";

export interface VehicleApiResult {
  vehicle: Vehicle;
  source: "active" | "inactive" | "decommissioned";
}

export async function fetchVehicleByPlate(
  plate: string
): Promise<VehicleApiResult | null> {
  const plateNum = parseInt(plate, 10);
  if (isNaN(plateNum)) return null;

  // 7 parallel calls
  const [mainRecords, extRecords, techRecords, ownerRecords, recallRecords, disabilityRecords, importRecords] =
    await Promise.all([
      queryDataGov(RESOURCES.ACTIVE_VEHICLES, { mispar_rechev: plateNum }, 1).catch(() => []),
      queryDataGov(RESOURCES.EXTENDED, { mispar_rechev: plateNum }, 1).catch(() => []),
      queryDataGov(RESOURCES.TECHNICAL_HISTORY, { mispar_rechev: plateNum }, 1).catch(() => []),
      queryDataGov(RESOURCES.OWNERSHIP_HISTORY, { mispar_rechev: plateNum }, 50).catch(() => []),
      queryDataGov(RESOURCES.RECALLS, { MISPAR_RECHEV: plateNum }, 20).catch(() => []),
      queryDataGov(RESOURCES.DISABILITY_TAG, { "MISPAR RECHEV": plateNum }, 1).catch(() => []),
      queryDataGov(RESOURCES.PERSONAL_IMPORT, { mispar_rechev: plateNum }, 1).catch(() => []),
    ]);

  let source: VehicleApiResult["source"] = "active";
  let main = mainRecords[0] as unknown as MainRecord | undefined;

  // Fallback: inactive
  if (!main) {
    const inactive = await queryDataGov(RESOURCES.INACTIVE_VEHICLES, { mispar_rechev: plateNum }, 1).catch(() => []);
    main = inactive[0] as unknown as MainRecord | undefined;
    if (main) source = "inactive";
  }

  // Fallback: decommissioned
  if (!main) {
    const decomm = await queryDataGov(RESOURCES.DECOMMISSIONED, { mispar_rechev: plateNum }, 1).catch(() => []);
    main = decomm[0] as unknown as MainRecord | undefined;
    if (main) source = "decommissioned";
  }

  if (!main) return null;

  const ext = extRecords[0] as unknown as ExtendedRecord | undefined;
  const tech = techRecords[0] as unknown as TechnicalRecord | undefined;
  const owners = ownerRecords as unknown as OwnershipRecord[];
  const recalls = recallRecords as unknown as RecallRecord[];
  const hasDisabilityTag = disabilityRecords.length > 0;
  const importRec = importRecords[0] as unknown as PersonalImportRecord | undefined;

  // Calls 7+8 — model specs + official price (depend on main, run in parallel)
  const [specRecords, priceRecords] = await Promise.all([
    queryDataGov(
      RESOURCES.MODEL_SPECS,
      {
        tozeret_cd: main.tozeret_cd,
        degem_cd: main.degem_cd,
        sug_degem: main.sug_degem ?? "",
      },
      1
    ).catch(() => []),
    queryDataGov(
      RESOURCES.PRICE_LIST,
      {
        tozeret_cd: main.tozeret_cd,
        degem_cd: main.degem_cd,
        shnat_yitzur: main.shnat_yitzur,
      },
      1
    ).catch(() => []),
  ]);
  const spec = specRecords[0] as unknown as ModelSpecRecord | undefined;
  const price = priceRecords[0] as unknown as PriceRecord | undefined;

  const vehicle = buildVehicle({ main, ext, tech, owners, recalls, hasDisabilityTag, spec, price, importRec, plate });
  vehicle.status = source;
  return { source, vehicle };
}

// ─── Helpers ────────────────────────────────────────────────

function buildVehicle(params: {
  main: MainRecord;
  ext?: ExtendedRecord;
  tech?: TechnicalRecord;
  owners: OwnershipRecord[];
  recalls: RecallRecord[];
  hasDisabilityTag: boolean;
  spec?: ModelSpecRecord;
  price?: PriceRecord;
  importRec?: PersonalImportRecord;
  plate: string;
}): Vehicle {
  const { main, ext, tech, owners: rawOwners, recalls: rawRecalls, hasDisabilityTag, spec, price, importRec, plate } = params;

  const manufacturerSlug = getManufacturerSlug(main.tozeret_nm ?? "");
  const year = main.shnat_yitzur ?? 0;
  const kmAtLastTest = tech?.kilometer_test_aharon ?? 0;
  const testExpiryDate = main.tokef_dt ? formatDate(main.tokef_dt) : "";
  const testLastDate = main.mivchan_acharon_dt ? formatDate(main.mivchan_acharon_dt) : "";
  const firstRegistrationDate = (tech?.rishum_rishon_dt ?? main.moed_aliya_lakvish)
    ? formatDate(tech?.rishum_rishon_dt ?? main.moed_aliya_lakvish)
    : "";

  const owners = buildOwners(rawOwners);
  const recalls = buildRecalls(rawRecalls);

  const structuralChange = tech?.shinui_mivne_ind === "1" || tech?.shinui_mivne_ind === "Y";
  const colorChanged = tech?.shnui_zeva_ind === "1" || tech?.shnui_zeva_ind === "Y";
  const tireChanged = tech?.shinui_zmig_ind === "1" || tech?.shinui_zmig_ind === "Y";

  const safety = buildSafety(spec);

  // וו גרירה — מתוך ה-dataset המורחב (grira_nm)
  const towHook = !!ext?.grira_nm && !ext.grira_nm.includes("אין");

  const num = (v: unknown): number => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  // מנקה ערכי "לא ידוע" / קודים ריקים מהמאגר → undefined
  const clean = (v: unknown): string | undefined => {
    const s = String(v ?? "").trim();
    if (!s || s.includes("לא ידוע")) return undefined;
    return s;
  };

  const riskBreakdown = calculateRisk({
    owners,
    year,
    testExpiryDate,
    kmAtLastTest,
    structuralChange,
    openRecallCount: recalls.filter((r) => r.open).length,
    firstOwnerType: owners[0]?.type,
  });

  const riskScore = Object.values(riskBreakdown).reduce((a, b) => a + b, 0);
  const riskTone = toneFromScore(riskScore);

  // yad = number of private owners (not dealer/leasing)
  const yad = owners.filter((o) => o.type === "פרטי").length;

  return {
    id: String(main.mispar_rechev),
    plate,
    manufacturer: main.tozeret_nm ?? "",
    manufacturerSlug,
    manufacturerCountry: countryFromManufacturer(main.tozeret_nm ?? ""),
    model: main.kinuy_mishari ?? main.degem_nm ?? "",
    trim: spec?.ramat_gimur || undefined,
    year,
    color: main.tzeva_rechev ?? "",
    fuelType: main.sug_delek_nm ?? "",
    yad,
    engineCC: num(spec?.nefah_manoa),
    horsepower: num(spec?.koah_sus),
    drivetrain: spec?.technologiat_hanaa_nm ?? "",
    gearbox: spec?.automatic_ind === 1 ? "אוטומטית" : spec ? "ידנית" : "",
    bodyType: spec?.merkav ? bodyTypeLabel(spec.merkav) : "",
    doors: num(spec?.mispar_dlatot),
    seats: num(spec?.mispar_moshavim),
    weightKg: num(spec?.mishkal_kolel),
    towingKg: num(spec?.kosher_grira_im_blamim),
    towingNoBrakes: num(spec?.kosher_grira_bli_blamim),
    firstRegistrationDate,
    testLastDate,
    testExpiryDate,
    kmAtLastTest,
    structuralChange,
    colorChanged,
    towHook,
    tireChanged,
    owners,
    recalls,
    safety,
    greenScore: num(spec?.madad_yarok),
    pollutionGroup: num(spec?.kvutzat_zihum),
    co2: num(spec?.CO2_WLTP ?? spec?.kamut_CO2),
    nox: num(spec?.NOX_WLTP ?? spec?.kamut_NOX),
    pmWltp: spec?.PM_WLTP != null ? num(spec.PM_WLTP) : undefined,
    hcWltp: spec?.HC_WLTP != null ? num(spec.HC_WLTP) : undefined,
    coWltp: spec?.CO_WLTP != null ? num(spec.CO_WLTP) : undefined,
    emissionStandard: clean(spec?.sug_tkina_nm),
    converterType: clean(spec?.sug_mamir_nm),
    propulsion: clean(spec?.technologiat_hanaa_nm),
    licenseFeeGroup: spec?.kvuzat_agra_cd != null ? num(spec.kvuzat_agra_cd) : undefined,
    originalPrice: price?.mehir != null ? num(price.mehir) : undefined,
    tireFront: main.zmig_kidmi ?? "",
    tireRear: main.zmig_ahori ?? "",
    loadFront: num(ext?.kod_omes_tzmig_kidmi),
    speedRating: ext?.kod_mehirut_tzmig_kidmi ?? "",
    hasDisabilityTag,
    chassis: clean(main.misgeret),
    isPersonalImport: !!importRec,
    importType: clean(importRec?.sug_yevu),
    riskScore,
    riskTone,
    riskLabel: labelFromTone(riskTone),
    riskBreakdown,
  };
}

function buildOwners(records: OwnershipRecord[]): Owner[] {
  if (!records.length) return [];

  const sorted = [...records].sort((a, b) =>
    String(a.baalut_dt).localeCompare(String(b.baalut_dt))
  );

  return sorted.map((r, i) => {
    const rawType = r.baalut ?? "";
    const type = ownerTypeLabel(rawType);
    const dateStr = String(r.baalut_dt ?? "");
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const date = month && year ? `${month}/${year}` : year;

    let durationMonths: number | undefined;
    if (i < sorted.length - 1) {
      const nextDateStr = String(sorted[i + 1].baalut_dt ?? "");
      durationMonths = monthsBetween(dateStr, nextDateStr);
    }

    return {
      date,
      type,
      durationMonths,
      current: i === sorted.length - 1,
    };
  });
}

function buildRecalls(records: RecallRecord[]): Recall[] {
  return records.map((r) => ({
    id: String(r.TAARICH_PTICHA ?? Math.random()),
    description: r.TEUR_TAKALA ?? "",
    openedAt: String(r.TAARICH_PTICHA ?? "").slice(0, 4),
    open: true,
  }));
}

function buildSafety(spec?: ModelSpecRecord): SafetyFeatures {
  const flag = (v: unknown) => v === "1" || v === "Y" || v === 1 || v === true;
  return {
    airbags: Number(spec?.mispar_kariot_avir ?? 0),
    abs: flag(spec?.abs_ind),
    esp: flag(spec?.bakarat_yatzivut_ind),
    laneAssist: flag(spec?.bakarat_stiya_menativ_ind),
    collisionWarning: flag(spec?.zihuy_matzav_hitkarvut_mesukenet_ind),
    pedestrianDetect: flag(spec?.zihuy_holchey_regel_ind),
    reverseCamera: flag(spec?.matzlemat_reverse_ind),
    emergencyBrake: flag(spec?.maarechet_ezer_labalam_ind),
    blindSpot: flag(spec?.zihuy_beshetah_nistar_ind),
    autoLights: flag(spec?.shlita_automatit_beorot_gvohim_ind),
    safetyScore: Number(spec?.nikud_betihut ?? 0),
    // הרחבות
    adaptiveCruise: flag(spec?.bakarat_shyut_adaptivit_ind),
    trafficSignRecognition: flag(spec?.zihuy_tamrurey_tnua_ind),
    tirePressure: flag(spec?.hayshaney_lahatz_avir_batzmigim_ind),
    seatbeltReminder: flag(spec?.hayshaney_hagorot_ind),
    reverseAeb: flag(spec?.blima_otomatit_nesia_leahor),
    equipLevel: spec?.ramat_eivzur_betihuty != null
      ? Number(spec.ramat_eivzur_betihuty)
      : undefined,
  };
}

// ─── Label helpers ───────────────────────────────────────────

function ownerTypeLabel(raw: string): Owner["type"] {
  if (raw.includes("פרטי")) return "פרטי";
  if (raw.includes("החכר") || raw.includes("ליסינג")) return "החכר (ליסינג)";
  if (raw.includes("סוחר")) return "סוחר";
  if (raw.includes("השכרה")) return "השכרה";
  if (raw.includes("חברה")) return "חברה";
  return "פרטי";
}

function bodyTypeLabel(merkav: string): string {
  const map: Record<string, string> = {
    "סדאן": "סדאן", "האצ׳בק": "האצ׳בק", "SUV": "SUV",
    "רכב שטח": "רכב שטח", "קומבי": "קומבי", "קופה": "קופה",
  };
  return map[merkav] ?? merkav;
}

function countryFromManufacturer(name: string): string {
  const map: Record<string, string> = {
    "טויוטה": "יפן", "הונדה": "יפן", "מזדה": "יפן", "מיצובישי": "יפן", "סובארו": "יפן", "ניסאן": "יפן",
    "קיה": "קוריאה", "יונדאי": "קוריאה",
    "פולקסווגן": "גרמניה", "אאודי": "גרמניה", "מרצדס": "גרמניה", "ב.מ.וו": "גרמניה", "אופל": "גרמניה",
    "פורד": "ארה״ב", "שברולט": "ארה״ב", "ג׳יפ": "ארה״ב", "טסלה": "ארה״ב",
    "פיאט": "איטליה", "אלפא רומיאו": "איטליה",
    "סיטרואן": "צרפת", "פיג׳ו": "צרפת", "רנו": "צרפת",
    "סקודה": "צ׳כיה", "סיאט": "ספרד",
    "וולוו": "שוודיה",
  };
  for (const [key, country] of Object.entries(map)) {
    if (name.includes(key)) return country;
  }
  return "";
}


function formatDate(raw: string | undefined): string {
  if (!raw) return "";
  // ISO date: "2026-01-15T00:00:00" or "2026-01-15"
  const match = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return String(raw);
}

function monthsBetween(yyyymm1: string, yyyymm2: string): number {
  const y1 = parseInt(yyyymm1.slice(0, 4), 10);
  const m1 = parseInt(yyyymm1.slice(4, 6), 10) || 1;
  const y2 = parseInt(yyyymm2.slice(0, 4), 10);
  const m2 = parseInt(yyyymm2.slice(4, 6), 10) || 1;
  return (y2 - y1) * 12 + (m2 - m1);
}
