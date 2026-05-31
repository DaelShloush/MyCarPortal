// הערכת שווי נוכחי משוערת לרכב יד שנייה.
// מבוסס על מחיר מחירון מקורי (חדש) + פחת לפי גיל + התאמת קילומטראז'.
// ⚠️ הערכה גסה בלבד — אינה מחליפה מחירון לוי יצחק / שמאי.

export interface ValueEstimate {
  mid: number; // הערכה מרכזית (₪)
  low: number; // קצה תחתון (₪)
  high: number; // קצה עליון (₪)
}

const AVG_KM_PER_YEAR = 15000;

export function estimateCurrentValue(
  originalPrice: number | undefined,
  year: number,
  kmAtLastTest: number
): ValueEstimate | null {
  if (!originalPrice || originalPrice <= 0 || !year) return null;

  const age = Math.max(0, new Date().getFullYear() - year);

  // פחת לפי גיל: ~8% בשנה הראשונה, ~10% בכל שנה לאחר מכן (מצטבר)
  let retention = age === 0 ? 0.92 : 0.85 * Math.pow(0.9, age - 1);

  // התאמת קילומטראז' מול הממוצע (15K/שנה)
  if (kmAtLastTest > 0 && age > 0) {
    const expectedKm = age * AVG_KM_PER_YEAR;
    const diff = kmAtLastTest - expectedKm;
    // כל 10K ק"מ סטייה = ±1.5% (חסום בין ‎-15%‎ ל-‎+10%‎)
    const kmAdj = Math.max(-0.15, Math.min(0.1, -(diff / 10000) * 0.015));
    retention *= 1 + kmAdj;
  }

  // רצפה: לא פחות מ-10% מהמחיר המקורי
  retention = Math.max(0.1, Math.min(1, retention));

  const round = (n: number) => Math.round(n / 100) * 100;
  const mid = round(originalPrice * retention);

  return {
    mid,
    low: round(mid * 0.9),
    high: round(mid * 1.1),
  };
}
