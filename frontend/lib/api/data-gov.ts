import { DATA_GOV_BASE } from "./data-gov-resources";

export interface DataGovRecord {
  [key: string]: unknown;
}

export interface DataGovResponse {
  result: {
    records: DataGovRecord[];
    total: number;
  };
  success: boolean;
}

export async function queryDataGov(
  resourceId: string,
  filters: Record<string, string | number>,
  limit = 100
): Promise<DataGovRecord[]> {
  const params = new URLSearchParams({
    resource_id: resourceId,
    filters: JSON.stringify(filters),
    limit: String(limit),
  });

  const res = await fetch(`${DATA_GOV_BASE}?${params}`, {
    headers: { "User-Agent": "MyCarPortal/1.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`data.gov.il error: ${res.status}`);

  const json: DataGovResponse = await res.json();
  if (!json.success) throw new Error("data.gov.il returned success:false");

  return json.result.records;
}

// Raw field types from the government API
export interface MainRecord {
  mispar_rechev: number;
  tozeret_nm: string;
  tozeret_cd: number;
  kinuy_mishari: string;
  degem_cd: number;
  degem_nm: string;
  sug_degem: string;
  shnat_yitzur: number;
  tzeva_rechev: string;
  tzeva_cd: number;
  sug_delek_nm: string;
  mivchan_acharon_dt: string;
  tokef_dt: string;
  baalut: string;
  misgeret: string;
  moed_aliya_lakvish: string;
  zmig_kidmi: string;
  zmig_ahori: string;
}

export interface ExtendedRecord {
  mispar_rechev: number;
  kod_omes_tzmig_kidmi: number;
  kod_omes_tzmig_ahori: number;
  kod_mehirut_tzmig_kidmi: string;
  kod_mehirut_tzmig_ahori: string;
  grira_nm: string; // תיאור וו גרירה ("אין וו גרירה" / "וו גרירה קבוע" וכו')
}

export interface TechnicalRecord {
  mispar_rechev: number;
  kilometer_test_aharon: number;
  shinui_mivne_ind: string;
  shnui_zeva_ind: string;
  shinui_zmig_ind: string;
  rishum_rishon_dt: string;
  mispar_manoa: string;
}

export interface OwnershipRecord {
  mispar_rechev: number;
  baalut_dt: string;
  baalut: string;
}

export interface RecallRecord {
  MISPAR_RECHEV: number;
  TEUR_TAKALA: string;
  SUG_TAKALA: string;
  TAARICH_PTICHA: string;
}

export interface DisabilityRecord {
  "MISPAR RECHEV": number;
  SUG_TAG: string;
  TAR_HATCHALA: string;
  TAR_SIYUM: string;
}

// שמות השדות האמיתיים מ-data.gov.il (resource 142afde2 — 90 שדות)
export interface ModelSpecRecord {
  tozeret_cd: number;
  degem_cd: number;
  sug_degem: string;
  // מנוע ומפרט
  nefah_manoa: number;
  koah_sus: number;
  mispar_dlatot: number;
  mispar_moshavim: number;
  mishkal_kolel: number;
  automatic_ind: number; // 1 = אוטומטי
  merkav: string; // סוג מרכב
  ramat_gimur: string; // רמת גימור
  technologiat_hanaa_nm: string; // הנעה רגילה / היברידי / חשמלי
  kosher_grira_im_blamim: number;
  kosher_grira_bli_blamim: number;
  kvuzat_agra_cd: number; // קבוצת אגרת רישוי
  mispar_halonot_hashmal: number;
  hege_koah_ind: number;
  mazgan_ind: number;
  // בטיחות
  nikud_betihut: number;
  ramat_eivzur_betihuty: number; // 0–8
  mispar_kariot_avir: number;
  abs_ind: number;
  bakarat_yatzivut_ind: number; // בקרת יציבות (ESP)
  bakarat_stiya_menativ_ind: number; // בקרת סטייה מנתיב
  zihuy_holchey_regel_ind: number;
  matzlemat_reverse_ind: number;
  maarechet_ezer_labalam_ind: number; // עזר לבלימה
  zihuy_beshetah_nistar_ind: number; // שטח מת
  zihuy_matzav_hitkarvut_mesukenet_ind: number; // ניטור מרחק / קדמי
  teura_automatit_benesiya_kadima_ind: number;
  shlita_automatit_beorot_gvohim_ind: number; // אורות גבוהים אוטומטיים
  bakarat_shyut_adaptivit_ind: number; // ACC
  zihuy_tamrurey_tnua_ind: number; // זיהוי תמרורים
  hayshaney_lahatz_avir_batzmigim_ind: number; // חיישני לחץ אוויר
  hayshaney_hagorot_ind: number; // חיישני חגורות
  blima_otomatit_nesia_leahor: number; // בלימת חירום ברוורס
  alco_lock: number;
  // סביבה ופליטות
  madad_yarok: number;
  kvutzat_zihum: number;
  sug_tkina_nm: string; // תקן זיהום (אירופאית/Euro)
  sug_mamir_nm: string; // סוג ממיר
  kamut_CO2: number | null;
  kamut_NOX: number | null;
  CO2_WLTP: number | null;
  NOX_WLTP: number | null;
  PM_WLTP: number | null;
  HC_WLTP: number | null;
  CO_WLTP: number | null;
  [key: string]: unknown;
}

// יבוא אישי (resource 03adc637)
export interface PersonalImportRecord {
  mispar_rechev: number;
  sug_yevu: string; // "יבוא אישי-משומש" וכו'
  tozeret_eretz_nm: string;
}

// מחירון רכב רשמי (resource 39f455bf)
export interface PriceRecord {
  tozeret_cd: number;
  degem_cd: number;
  shnat_yitzur: number;
  mehir: number; // מחיר מחירון בש"ח
  kinuy_mishari: string;
}

// כמויות רכבים לפי דגם (resource 5e87a7a1) — שורה לכל שנת ייצור
export interface ModelQuantityRecord {
  tozeret_cd: number;
  degem_cd: number;
  shnat_yitzur: number;
  mispar_rechavim_pailim: number;     // פעילים
  mispar_rechavim_le_pailim: number;  // לא-פעילים (ירדו מהכביש)
}
