// מחשבון עלות בעלות (TCO) משוערת — אגרת רישוי + עלות דלק שנתית.
// מבוסס על נתוני data.gov.il (קבוצת אגרה, פליטות CO2 WLTP) + מחירים עדכניים.
// ⚠️ הערכות בלבד. מחירי דלק ואגרות משתנים; אגרה מוצגת לרכב חדש (יורדת עם הגיל).

import type { Vehicle } from "./types";

// אגרת רישוי שנתית לפי קבוצת אגרה (כולל אגרת רדיו) — תקף מינואר 2026
const LICENSE_FEE_2026: Record<number, number> = {
  1: 1372,
  2: 1707,
  3: 2030,
  4: 2394,
  5: 2722,
  6: 3806,
  7: 5365,
};

// מחירים משוערים (~מאי 2026)
const PRICE = {
  petrol: 8.07, // ₪/ליטר (בנזין 95)
  diesel: 7.3, // ₪/ליטר (סולר)
  electric: 0.62, // ₪/קוט"ש
};

const AVG_KM_PER_YEAR = 15000;

type FuelKind = "petrol" | "diesel" | "electric" | "hybrid" | "unknown";

function detectFuel(vehicle: Vehicle): FuelKind {
  const s = `${vehicle.fuelType} ${vehicle.propulsion ?? ""}`;
  if (/חשמל/.test(s)) return "electric";
  if (/היבריד|היברידי/.test(s)) return "hybrid";
  if (/דיזל|סולר/.test(s)) return "diesel";
  if (/בנזין/.test(s)) return "petrol";
  return "unknown";
}

export interface CostEstimate {
  annualKm: number;
  licenseFee?: number; // ₪/שנה
  // דלק/אנרגיה
  fuelKind: FuelKind;
  consumptionPer100?: number; // ל'/100ק"מ או קוט"ש/100ק"מ
  consumptionUnit: string;
  annualEnergyCost?: number; // ₪/שנה
  // סיכום
  annualTotal?: number; // אגרה + דלק
  fiveYearTotal?: number;
}

export function estimateCosts(vehicle: Vehicle): CostEstimate | null {
  const age = vehicle.year ? Math.max(1, new Date().getFullYear() - vehicle.year) : 1;

  // ק"מ שנתי
  let annualKm = AVG_KM_PER_YEAR;
  if (vehicle.kmAtLastTest > 0) {
    annualKm = Math.round(vehicle.kmAtLastTest / age);
    annualKm = Math.max(5000, Math.min(40000, annualKm));
  }

  const fuelKind = detectFuel(vehicle);

  // אגרת רישוי לפי קבוצת אגרה
  const licenseFee =
    vehicle.licenseFeeGroup && LICENSE_FEE_2026[vehicle.licenseFeeGroup]
      ? LICENSE_FEE_2026[vehicle.licenseFeeGroup]
      : undefined;

  // צריכה ועלות אנרגיה
  let consumptionPer100: number | undefined;
  let consumptionUnit = 'ל\'/100 ק"מ';
  let annualEnergyCost: number | undefined;

  const co2 = vehicle.co2; // g/km (WLTP)

  if (fuelKind === "electric") {
    consumptionPer100 = 16; // הערכה טיפוסית קוט"ש/100ק"מ
    consumptionUnit = 'קוט"ש/100 ק"מ';
    annualEnergyCost = Math.round((consumptionPer100 / 100) * annualKm * PRICE.electric);
  } else if (co2 > 0 && (fuelKind === "petrol" || fuelKind === "diesel" || fuelKind === "hybrid")) {
    // המרת CO2 (g/km) לצריכת דלק (ל'/100ק"מ)
    const divisor = fuelKind === "diesel" ? 26.4 : 23.9;
    consumptionPer100 = Math.round((co2 / divisor) * 10) / 10;
    const price = fuelKind === "diesel" ? PRICE.diesel : PRICE.petrol;
    annualEnergyCost = Math.round((consumptionPer100 / 100) * annualKm * price);
  }

  if (licenseFee === undefined && annualEnergyCost === undefined) return null;

  const annualTotal =
    licenseFee !== undefined || annualEnergyCost !== undefined
      ? (licenseFee ?? 0) + (annualEnergyCost ?? 0)
      : undefined;

  return {
    annualKm,
    licenseFee,
    fuelKind,
    consumptionPer100,
    consumptionUnit,
    annualEnergyCost,
    annualTotal,
    fiveYearTotal: annualTotal ? annualTotal * 5 : undefined,
  };
}
