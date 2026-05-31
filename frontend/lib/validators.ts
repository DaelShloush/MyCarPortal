// ולידציה לקלט משתמש — מספרי רישוי ישראליים

export interface PlateValidation {
  valid: boolean;
  cleaned: string; // רק ספרות
  error?: string;
}

/**
 * מנקה ומאמת מספר רישוי ישראלי.
 * מספרי רישוי בישראל: 5–8 ספרות (ישן 5–6, חדש 7–8).
 * מסיר מקפים, רווחים ותווים לא-מספריים.
 */
export function validatePlate(input: string): PlateValidation {
  const cleaned = (input ?? "").replace(/\D/g, "");

  if (cleaned.length === 0) {
    return { valid: false, cleaned, error: "יש להזין מספר רישוי" };
  }
  if (cleaned.length < 5) {
    return {
      valid: false,
      cleaned,
      error: "מספר רישוי קצר מדי (לפחות 5 ספרות)",
    };
  }
  if (cleaned.length > 8) {
    return {
      valid: false,
      cleaned,
      error: "מספר רישוי ארוך מדי (עד 8 ספרות)",
    };
  }
  return { valid: true, cleaned };
}

/**
 * מעצב מספר רישוי לתצוגה עם מקפים, לפי הפורמט הישראלי:
 * 7 ספרות → XX-XXX-XX  (12-345-67)
 * 8 ספרות → XXX-XX-XXX (123-45-678)
 * אחרת — מחזיר כמו שהוא.
 */
export function formatPlate(plate: string): string {
  const d = plate.replace(/\D/g, "");
  if (d.length === 7) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
  if (d.length === 8) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  return d;
}
