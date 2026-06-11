// ממפה שם יצרן (עברית/אנגלית) לסלאג ב-avto-dev CDN
// https://github.com/avto-dev/vehicle-logotypes

const LOGO_MAP: Record<string, string> = {
  // עברית
  "טויוטה": "toyota",
  "הונדה": "honda",
  "מזדה": "mazda",
  "מיצובישי": "mitsubishi",
  "סובארו": "subaru",
  "ניסאן": "nissan",
  "יונדאי": "hyundai",
  "קיה": "kia",
  "שברולט": "chevrolet",
  "פולקסווגן": "volkswagen",
  "סקודה": "skoda",
  "סיאט": "seat",
  "אאודי": "audi",
  "מרצדס בנץ": "mercedes-benz",
  "מרצדס": "mercedes-benz",
  "ב.מ.וו": "bmw",
  "BMW": "bmw",
  "פורד": "ford",
  "אופל": "opel",
  "פיג'ו": "peugeot",
  "ציטרואן": "citroen",
  "רנו": "renault",
  "פיאט": "fiat",
  "אלפא רומיאו": "alfa-romeo",
  "וולוו": "volvo",
  "וולבו": "volvo", // האיות בפועל ב-data.gov.il ("וולבו שוודיה")
  "סאאב": "saab",
  "סוזוקי": "suzuki",
  "דייהטסו": "daihatsu",
  "לקסוס": "lexus",
  "אינפיניטי": "infiniti",
  "אקורה": "acura",
  "קאדילק": "cadillac",
  "ג'יפ": "jeep",
  "דודג'": "dodge",
  "ג'י.אמ.סי": "gmc",
  "לנד רובר": "land-rover",
  "ג'גואר": "jaguar",
  "פורשה": "porsche",
  "מיני": "mini",
  "סמארט": "smart",
  "טסלה": "tesla",
  "ב.י.ד": "byd",
  "BYD": "byd",
  "MG": "mg",
  // אנגלית (fallback)
  "toyota": "toyota",
  "honda": "honda",
  "mazda": "mazda",
  "mitsubishi": "mitsubishi",
  "subaru": "subaru",
  "nissan": "nissan",
  "hyundai": "hyundai",
  "kia": "kia",
  "volkswagen": "volkswagen",
  "skoda": "skoda",
  "seat": "seat",
  "audi": "audi",
  "ford": "ford",
  "opel": "opel",
  "peugeot": "peugeot",
  "citroen": "citroen",
  "renault": "renault",
  "fiat": "fiat",
  "volvo": "volvo",
  "suzuki": "suzuki",
  "lexus": "lexus",
  "jeep": "jeep",
  "tesla": "tesla",
};

// מפתחות עבריים, ממוינים מהארוך לקצר — כדי שההתאמה תעדיף שם ספציפי
// (למשל "מרצדס בנץ" לפני "מרצדס") ולא תיתפס על מילה חלקית.
const HEBREW_KEYS = Object.keys(LOGO_MAP)
  .filter((k) => /[֐-׿]/.test(k))
  .sort((a, b) => b.length - a.length);

/**
 * התאמת שם יצרן עברי מתוך מחרוזת tozeret_nm לפי תחילת-מילה.
 * חשוב: לא התאמת-הכלה (includes) — "רנו טורקיה" מכיל את "קיה" בסוף המילה
 * "טורקיה" וגרם ללוגו KIA על רנו. מפצלים למילים (רווח/מקף) ודורשים שהמילה
 * תתחיל במפתח; מפתח רב-מילי ("מרצדס בנץ") נבדק בהכלה רגילה.
 */
export function matchHebrewName(name: string, keys: string[]): string | undefined {
  const words = name.split(/[\s\-–—]+/).filter(Boolean);
  for (const key of keys) {
    const found = key.includes(" ")
      ? name.includes(key)
      : words.some((w) => w.startsWith(key));
    if (found) return key;
  }
  return undefined;
}

export function getManufacturerSlug(name: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // 1) התאמה מדויקת
  if (LOGO_MAP[trimmed]) return LOGO_MAP[trimmed];
  if (LOGO_MAP[lower]) return LOGO_MAP[lower];

  // 2) התאמה לפי תחילת-מילה — שמות אמיתיים ב-data.gov.il כוללים סיומות מדינה
  //    ("הונדה-ארה\"ב", "מרוטי-סוזוקי", "רנו טורקיה")
  const key = matchHebrewName(trimmed, HEBREW_KEYS);
  if (key) return LOGO_MAP[key];

  // 3) fallback — ניקוי בסיסי (בד"כ ייכשל ב-CDN ואז ה-UI יציג placeholder)
  return lower.replace(/\s+/g, "-");
}
