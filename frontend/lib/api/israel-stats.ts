// סטטיסטיקות ארציות על צי הרכב בישראל — לעמוד הבית.
// כל המספרים נספרים חי מול data.gov.il (queryDataGovCount → total),
// עם cache יומי. נכשל בשקט (null) כדי שעמוד הבית לעולם לא יישבר בגלל זה.

import { queryDataGovCount, queryDataGovSorted } from "./data-gov";
import { RESOURCES } from "./data-gov-resources";
import { matchHebrewName } from "../manufacturer-logos";

export interface FuelStat {
  label: string;
  count: number;
  pct: number; // אחוז מסך הרכבים הפעילים (0-100, מעוגל לעשירית)
}

export interface TopModel {
  name: string;         // kinuy_mishari — "MAZDA 3"
  manufacturer: string; // tozeret_nm — "מזדה יפן"
  count: number;        // רכבים פעילים על הכביש (סכום על פני שנתונים)
}

export interface BrandStat {
  name: string;  // שם מותג מנורמל — "טויוטה"
  count: number; // רכבים פעילים (מצרף כל הדגמים והמדינות: "טויוטה יפן"+"טויוטה טורקיה")
}

export interface YearEvStat {
  year: number;
  total: number;    // כל הרכבים הפעילים מהשנתון
  electric: number; // מתוכם חשמליים מלאים
  pct: number;      // אחוז (עשירית)
}

export interface IsraelStats {
  totalActive: number;
  fuels: FuelStat[];
  electricCount: number;
  hybridCount: number;
  newestYearCount: number; // רכבים מדגם השנה הנוכחית
  lastYearCount: number;   // רכבים מדגם השנה שעברה
  currentYear: number;
  topModels: TopModel[];
  topBrands: BrandStat[];
  evTrend: YearEvStat[];   // מהפכת החשמל — אחוז חשמליים לפי שנתון
  openRecalls: number;     // רכבים עם ריקול פתוח בישראל
  activeTaxis: number;     // מוניות פעילות
  disabilityTags: number;  // רכבים עם תג נכה
  everRemoved: number;     // ירדו מהכביש אי-פעם (לא פעילים + מבוטלים סופית)
}

// ערכי sug_delek_nm האמיתיים במאגר (אומתו מול ה-API; אין ערך "היברידי" נפרד)
const FUEL_VALUES: { value: string; label: string }[] = [
  { value: "בנזין", label: "בנזין" },
  { value: "דיזל", label: "דיזל" },
  { value: "חשמל/בנזין", label: "היברידי (חשמל/בנזין)" },
  { value: "חשמל", label: "חשמלי" },
  { value: 'גפ"מ', label: 'גפ"מ' },
];

// כמה שורות דגם-שנתון מושכים לחישוב הדגמים/מותגים המובילים. השורות ממוינות
// יורד, כך שזנב קטן שלא נכנס משפיע מעט מאוד על הראשונים ברשימה.
const TOP_ROWS_LIMIT = 3000;

// כמה שנתונים אחורה למגמת החשמל (כולל השנה הנוכחית)
const EV_TREND_YEARS = 6;

// שמות מותגים לזיהוי בתוך tozeret_nm (ממוין מהארוך לקצר — עקבי עם הלוגו)
const BRAND_KEYS = [
  "אלפא רומיאו", "בי ווי די", "מיצובישי", "פולקסווגן", "סיטרואן",
  "שברולט", "טויוטה", "יונדאי", "סובארו", "דאצ'יה", "ב.מ.וו",
  "מרצדס", "לקסוס", "סוזוקי", "סקודה", "ניסאן", "הונדה", "טסלה",
  "וולבו", "וולוו", "פיג'ו", "אאודי", "אופל", "פורד", "פיאט",
  "מזדה", "סיאט", "רנו", "קיה", "מ.ג",
].sort((a, b) => b.length - a.length);

// איחוד איותים + שמות תצוגה
const BRAND_DISPLAY: Record<string, string> = {
  "וולבו": "וולוו",
  "בי ווי די": "BYD",
  "מ.ג": "MG",
};

export async function fetchIsraelStats(): Promise<IsraelStats | null> {
  try {
    const currentYear = new Date().getFullYear();
    const trendYears = Array.from(
      { length: EV_TREND_YEARS },
      (_, i) => currentYear - (EV_TREND_YEARS - 1) + i
    );

    const count = queryDataGovCount;
    const ACTIVE = RESOURCES.ACTIVE_VEHICLES;

    const [
      total,
      fuelCounts,
      newestYearCount,
      lastYearCount,
      yearTotals,
      yearElectrics,
      openRecalls,
      activeTaxis,
      disabilityTags,
      inactiveCount,
      decommissionedCount,
      topRows,
    ] = await Promise.all([
      count(ACTIVE),
      Promise.all(FUEL_VALUES.map((f) => count(ACTIVE, { sug_delek_nm: f.value }))),
      count(ACTIVE, { shnat_yitzur: currentYear }),
      count(ACTIVE, { shnat_yitzur: currentYear - 1 }),
      Promise.all(trendYears.map((y) => count(ACTIVE, { shnat_yitzur: y }))),
      Promise.all(
        trendYears.map((y) => count(ACTIVE, { shnat_yitzur: y, sug_delek_nm: "חשמל" }))
      ),
      count(RESOURCES.RECALLS),
      count(RESOURCES.PUBLIC_VEHICLES, { sug_rechev_nm: "מונית", bitul_nm: "לא מבוטל" }),
      count(RESOURCES.DISABILITY_TAG),
      count(RESOURCES.INACTIVE_VEHICLES),
      count(RESOURCES.DECOMMISSIONED),
      queryDataGovSorted(
        RESOURCES.MODEL_QUANTITIES,
        "mispar_rechavim_pailim desc",
        TOP_ROWS_LIMIT,
        "tozeret_nm,kinuy_mishari,mispar_rechavim_pailim"
      ),
    ]);

    if (!total) return null;

    // ── התפלגות דלקים ──
    const fuels: FuelStat[] = FUEL_VALUES.map((f, i) => ({
      label: f.label,
      count: fuelCounts[i],
      pct: Math.round((fuelCounts[i] / total) * 1000) / 10,
    })).filter((f) => f.count > 0);

    const known = fuelCounts.reduce((a, b) => a + b, 0);
    if (total - known > 0) {
      fuels.push({
        label: "אחר",
        count: total - known,
        pct: Math.round(((total - known) / total) * 1000) / 10,
      });
    }

    // ── מגמת החשמל לפי שנתון ──
    const evTrend: YearEvStat[] = trendYears.map((year, i) => ({
      year,
      total: yearTotals[i],
      electric: yearElectrics[i],
      pct: yearTotals[i] > 0
        ? Math.round((yearElectrics[i] / yearTotals[i]) * 1000) / 10
        : 0,
    }));

    // ── דגמים ומותגים מובילים — מאותן שורות, בלי קריאות נוספות ──
    const byModel = new Map<string, TopModel>();
    const byBrand = new Map<string, number>();
    const rows = topRows as Array<{
      tozeret_nm?: string;
      kinuy_mishari?: string;
      mispar_rechavim_pailim?: number;
    }>;

    for (const row of rows) {
      const cnt = Number(row.mispar_rechavim_pailim) || 0;
      if (!cnt) continue;

      const name = (row.kinuy_mishari ?? "").trim();
      const manufacturer = (row.tozeret_nm ?? "").trim();

      if (name) {
        const existing = byModel.get(name);
        if (existing) existing.count += cnt;
        else byModel.set(name, { name, manufacturer, count: cnt });
      }

      const brandKey = matchHebrewName(manufacturer, BRAND_KEYS);
      if (brandKey) {
        const display = BRAND_DISPLAY[brandKey] ?? brandKey;
        byBrand.set(display, (byBrand.get(display) ?? 0) + cnt);
      }
    }

    const topModels = [...byModel.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topBrands: BrandStat[] = [...byBrand.entries()]
      .map(([name, cnt]) => ({ name, count: cnt }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalActive: total,
      fuels,
      electricCount: fuelCounts[3] ?? 0,
      hybridCount: fuelCounts[2] ?? 0,
      newestYearCount,
      lastYearCount,
      currentYear,
      topModels,
      topBrands,
      evTrend,
      openRecalls,
      activeTaxis,
      disabilityTags,
      everRemoved: inactiveCount + decommissionedCount,
    };
  } catch {
    return null; // עמוד הבית ימשיך לעבוד עם הסטריפ הסטטי
  }
}
