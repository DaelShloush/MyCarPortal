// בונה URL לתמונת רכב מ-imagin.studio (CGI render לפי יצרן/דגם/שנה/צבע).
// חינמי דרך demo customer (יש watermark קטן). ניתן לעקוף עם NEXT_PUBLIC_IMAGIN_CUSTOMER.
// אין כאן צילום של הרכב הספציפי — אין מקור ציבורי לכך. זו תמונה מייצגת של הדגם.

import { getManufacturerSlug } from "./manufacturer-logos";

const CUSTOMER = process.env.NEXT_PUBLIC_IMAGIN_CUSTOMER || "img";
const BASE = "https://cdn.imagin.studio/getimage";

// מיפוי צבע עברי → paintDescription באנגלית (זיהוי לפי מילת מפתח).
const COLOR_KEYWORDS: Array<[RegExp, string]> = [
  [/לבן|שנהב/, "white"],
  [/שחור/, "black"],
  [/כסף|כסוף/, "silver"],
  [/אפור|מתכת|עכבר/, "grey"],
  [/כחול|תכלת/, "blue"],
  [/אדום|בורדו/, "red"],
  [/ירוק/, "green"],
  [/צהוב/, "yellow"],
  [/כתום/, "orange"],
  [/חום|בז'|בז|שמפניה/, "brown"],
  [/זהב/, "gold"],
  [/ורוד/, "pink"],
  [/סגול/, "purple"],
  [/בז'|קרם/, "beige"],
];

function mapColor(color?: string | null): string | undefined {
  if (!color) return undefined;
  for (const [re, en] of COLOR_KEYWORDS) {
    if (re.test(color)) return en;
  }
  return undefined; // לא זוהה — נשאיר ל-imagin לבחור צבע ברירת מחדל
}

// kinuy_mishari לרוב כבר באנגלית ("COROLLA", "C250"). מנקים ל-modelFamily ש-imagin מזהה.
// מותגי יוקרה משתמשים בשם דגם+מנוע ("C250") בעוד imagin מצפה למשפחה ("c-class") —
// לכן יש כללים פר-יצרן. לשאר היצרנים שומרים את השם כמו שהוא (COROLLA/SPORTAGE עובדים).
function normalizeModel(model: string | null | undefined, makeSlug: string): string | undefined {
  if (!model) return undefined;
  const clean = model
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return undefined;

  const first = clean.split(" ")[0]; // הטוקן הראשון = משפחת הדגם (השאר = מנוע/גימור)

  if (makeSlug === "mercedes-benz") {
    // C250→c-class · E250→e-class · A180→a-class · GLC250→glc · CLA200→cla
    const letters = first.match(/^([a-z]+)/)?.[1];
    if (letters) return letters.length === 1 ? `${letters}-class` : letters;
  }
  if (makeSlug === "bmw") {
    // 320i→3-series · 118d→1-series · X5→x5 · M3→m3 · i3→i3
    const digit = first.match(/^(\d)/)?.[1];
    return digit ? `${digit}-series` : first;
  }
  if (makeSlug === "lexus") {
    // NX200T→nx · RX450H→rx · IS300→is · CT200H→ct
    const letters = first.match(/^([a-z]{2})/)?.[1];
    if (letters) return letters;
  }

  return clean;
}

export interface CarImageInput {
  manufacturer?: string | null;
  model?: string | null;
  year?: number | null;
  color?: string | null;
  /** זווית 1-29 (imagin). 23 = שלושת-רבעי קדמי, נראה הכי טוב. */
  angle?: number;
  /** רוחב מבוקש בפיקסלים (free tier מוגבל). */
  width?: number;
}

/**
 * מחזיר URL לתמונת רכב, או null אם אין מספיק נתונים (אז ה-UI יפול ל-placeholder).
 */
export function buildCarImageUrl({
  manufacturer,
  model,
  year,
  color,
  angle = 23,
  width = 800,
}: CarImageInput): string | null {
  const make = getManufacturerSlug(manufacturer || "");
  if (!make) return null; // בלי יצרן מזוהה אין טעם לפנות ל-imagin

  const params = new URLSearchParams({
    customer: CUSTOMER,
    make,
    angle: String(angle),
    width: String(width),
    zoomType: "fullscreen",
    fileType: "webp",
  });

  const family = normalizeModel(model, make);
  if (family) params.set("modelFamily", family);

  if (year) params.set("modelYear", String(year));

  const paint = mapColor(color);
  if (paint) params.set("paintDescription", paint);

  return `${BASE}?${params.toString()}`;
}
