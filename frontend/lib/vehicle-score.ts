// ציון רכב 0–100 (גבוה = טוב) — שקלול דגלי האזהרה מנתוני משרד התחבורה.
// כל בדיקה כוללת הסבר קצר למשתמש: מה נבדק ולמה זה חשוב.
// ⚠️ הציון אינדיקטיבי בלבד — מבוסס על מידע ציבורי, לא מחליף בדיקת מכון.

import type { Vehicle } from "./types";

export type CheckStatus = "ok" | "flag" | "na";

export interface ScoreCheck {
  id: string;
  label: string;        // שם הבדיקה — "ריקול פתוח"
  explanation: string;  // הסבר קצר: מה המשמעות ולמה זה משפיע על הציון
  status: CheckStatus;  // ok = תקין · flag = נמצאה בעיה (נוכו נקודות) · na = אין מידע
  deducted: number;     // כמה נקודות ירדו (0 כשתקין או כשאין מידע)
  detail?: string;      // פירוט דינמי — "2 ריקולים פתוחים", "22,400 ק״מ/שנה"
}

export interface VehicleScore {
  score: number; // 0–100
  grade: { label: string; tone: "good" | "ok" | "warn" | "bad" };
  checks: ScoreCheck[];
}

// ממוצע ק"מ שנתי ארצי — בסיס ההשוואה לבדיקת הקילומטראז'
const NATIONAL_AVG_KM_PER_YEAR = 15000;
// סף חריגה: 25% מעל הממוצע נחשב שימוש מוגבר
const HIGH_KM_THRESHOLD = NATIONAL_AVG_KM_PER_YEAR * 1.25;

export function computeVehicleScore(vehicle: Vehicle): VehicleScore {
  const checks: ScoreCheck[] = [];
  const add = (c: ScoreCheck) => checks.push(c);

  // ─── 1. סטטוס רישום (מבוטל / לא פעיל) ─────────────────────────
  if (vehicle.status === "decommissioned") {
    add({
      id: "status",
      label: "סטטוס רישום",
      explanation:
        "הרכב רשום במאגר הרכבים שבוטלו סופית (גריטה). רכב כזה אינו חוקי לנסיעה, ואם הוא מוצע למכירה כרכב פעיל — זהו דגל אדום חמור.",
      status: "flag",
      deducted: 60,
      detail: "מבוטל / ירד מהכביש",
    });
  } else if (vehicle.status === "inactive") {
    add({
      id: "status",
      label: "סטטוס רישום",
      explanation:
        "הרכב לא מופיע במאגר הרכבים הפעילים — ייתכן רישיון שפג, אי-תשלום אגרה או הורדה זמנית מהכביש. חשוב לברר את הסיבה לפני רכישה.",
      status: "flag",
      deducted: 25,
      detail: "לא פעיל",
    });
  } else {
    add({
      id: "status",
      label: "סטטוס רישום",
      explanation: "הרכב מופיע במאגר הרכבים הפעילים של משרד התחבורה.",
      status: "ok",
      deducted: 0,
      detail: "פעיל",
    });
  }

  // ─── 2. שימוש ציבורי (מונית / הסעות) ─────────────────────────
  if (vehicle.isPublicVehicle) {
    add({
      id: "public",
      label: "שימוש ציבורי",
      explanation:
        "הרכב רשום במאגר הרכבים הציבוריים. מונית או רכב הסעות צובר קילומטראז' ושחיקה גבוהים משמעותית מרכב פרטי — גם אם מד הק\"מ נראה סביר.",
      status: "flag",
      deducted: 20,
      detail: vehicle.publicVehicleType ?? "רשום כרכב ציבורי",
    });
  } else {
    add({
      id: "public",
      label: "שימוש ציבורי",
      explanation: "הרכב לא נמצא במאגר המוניות והרכבים הציבוריים.",
      status: "ok",
      deducted: 0,
      detail: "לא רשום",
    });
  }

  // ─── 3. ריקולים פתוחים ────────────────────────────────────────
  const openRecalls = vehicle.recalls.filter((r) => r.open).length;
  if (openRecalls > 0) {
    add({
      id: "recalls",
      label: "ריקולים פתוחים",
      explanation:
        "קריאת תיקון בטיחותית מהיצרן שטרם בוצעה. התיקון עצמו חינם אצל היבואן, אבל ריקול פתוח אומר שהתקלה עדיין קיימת ברכב.",
      status: "flag",
      deducted: 15,
      detail: openRecalls === 1 ? "ריקול פתוח אחד" : `${openRecalls} ריקולים פתוחים`,
    });
  } else {
    add({
      id: "recalls",
      label: "ריקולים פתוחים",
      explanation: "לא נמצאו קריאות תיקון פתוחות לרכב זה במאגר משרד התחבורה.",
      status: "ok",
      deducted: 0,
      detail: "אין",
    });
  }

  // ─── 4. שינוי מבנה ────────────────────────────────────────────
  if (vehicle.structuralChange) {
    add({
      id: "structure",
      label: "שינוי מבנה",
      explanation:
        "דווח שינוי מבנה לרכב. לעיתים מדובר בשינוי לגיטימי (וו גרירה, גז), אך זה עשוי גם להעיד על תיקון לאחר תאונה — חובה לבדוק במכון.",
      status: "flag",
      deducted: 12,
      detail: "דווח שינוי",
    });
  } else {
    add({
      id: "structure",
      label: "שינוי מבנה",
      explanation: "לא דווח שינוי מבנה — שלדת הרכב לא עברה שינוי רשום.",
      status: "ok",
      deducted: 0,
      detail: "ללא שינוי",
    });
  }

  // ─── 5. תוקף רישיון (טסט) ─────────────────────────────────────
  if (!vehicle.testExpiryDate) {
    add({
      id: "test",
      label: "תוקף רישיון רכב",
      explanation: "אין תאריך תוקף במאגר — לא ניתן לבדוק.",
      status: "na",
      deducted: 0,
    });
  } else if (vehicle.testExpired) {
    add({
      id: "test",
      label: "תוקף רישיון רכב",
      explanation:
        "רישיון הרכב פג — הרכב אינו חוקי לנסיעה עד חידוש הרישיון ומעבר מבחן רישוי. ברכב שעומד זמן רב ללא טסט ייתכנו בעיות מכניות.",
      status: "flag",
      deducted: 10,
      detail: `פג בתאריך ${vehicle.testExpiryDate}`,
    });
  } else {
    add({
      id: "test",
      label: "תוקף רישיון רכב",
      explanation: "רישיון הרכב בתוקף — הרכב עבר את מבחן הרישוי האחרון הנדרש.",
      status: "ok",
      deducted: 0,
      detail: `בתוקף עד ${vehicle.testExpiryDate}`,
    });
  }

  // ─── 6-8. בדיקות מבוססות היסטוריית בעלויות ────────────────────
  const hasOwnership = vehicle.owners.length > 0;

  // 6. מקור הרכב — ליסינג / השכרה
  if (!hasOwnership) {
    add({
      id: "origin",
      label: "מקור הרכב",
      explanation: "אין נתוני בעלויות במאגר (זמינים רק לרכבים מ-2017 ואילך).",
      status: "na",
      deducted: 0,
    });
  } else {
    const firstType = vehicle.owners[0]?.type;
    const startedCommercial = firstType === "החכר (ליסינג)" || firstType === "השכרה";
    if (startedCommercial) {
      add({
        id: "origin",
        label: "מקור הרכב",
        explanation:
          "הרכב התחיל את חייו כרכב ליסינג או השכרה — בדרך כלל קילומטראז' גבוה בשנים הראשונות, ולעיתים נהגים מתחלפים. לא פוסל, אבל מצריך בדיקה.",
        status: "flag",
        deducted: 8,
        detail: firstType,
      });
    } else {
      add({
        id: "origin",
        label: "מקור הרכב",
        explanation: "הרכב לא התחיל את דרכו כליסינג או השכרה.",
        status: "ok",
        deducted: 0,
        detail: firstType ?? "פרטי",
      });
    }
  }

  // 7. בעלויות קצרות — בעלים פרטיים שהחזיקו פחות משנה
  if (!hasOwnership) {
    add({
      id: "short-owners",
      label: "יציבות בעלויות",
      explanation: "אין נתוני בעלויות במאגר — לא ניתן לבדוק.",
      status: "na",
      deducted: 0,
    });
  } else {
    const shortOwners = vehicle.owners.filter(
      (o) => o.type === "פרטי" && o.durationMonths != null && o.durationMonths < 12
    ).length;
    if (shortOwners >= 2) {
      add({
        id: "short-owners",
        label: "יציבות בעלויות",
        explanation:
          "שני בעלים פרטיים או יותר החזיקו ברכב פחות משנה כל אחד. כשרכב 'מתגלגל' מהר בין ידיים — לפעמים יש סיבה שמגלים רק אחרי הקנייה.",
        status: "flag",
        deducted: 8,
        detail: `${shortOwners} בעלויות קצרות משנה`,
      });
    } else {
      add({
        id: "short-owners",
        label: "יציבות בעלויות",
        explanation: "הבעלים החזיקו ברכב תקופות סבירות — אין דפוס של מכירה חוזרת מהירה.",
        status: "ok",
        deducted: 0,
      });
    }
  }

  // 8. מספר בעלים (יד)
  if (!hasOwnership) {
    add({
      id: "yad",
      label: "מספר בעלים",
      explanation: "אין נתוני בעלויות במאגר — לא ניתן לבדוק.",
      status: "na",
      deducted: 0,
    });
  } else if (vehicle.yad >= 4) {
    add({
      id: "yad",
      label: "מספר בעלים",
      explanation:
        "יד 4 ומעלה — החלפות ידיים רבות מקשות לשחזר את היסטוריית הטיפולים והתאונות של הרכב, ובדרך כלל מורידות את ערכו.",
      status: "flag",
      deducted: 6,
      detail: `יד ${vehicle.yad}`,
    });
  } else {
    add({
      id: "yad",
      label: "מספר בעלים",
      explanation: "מספר בעלים סביר ביחס לרכב יד שנייה.",
      status: "ok",
      deducted: 0,
      detail: vehicle.yad > 0 ? `יד ${vehicle.yad}` : undefined,
    });
  }

  // ─── 9. קילומטראז' מול הממוצע הארצי ──────────────────────────
  const age = vehicle.year ? Math.max(1, new Date().getFullYear() - vehicle.year) : 0;
  if (!vehicle.kmAtLastTest || !age) {
    add({
      id: "km",
      label: "קילומטראז'",
      explanation: "אין נתון ק\"מ ממבחן הרישוי האחרון — לא ניתן להשוות לממוצע.",
      status: "na",
      deducted: 0,
    });
  } else {
    const annualKm = Math.round(vehicle.kmAtLastTest / age);
    if (annualKm > HIGH_KM_THRESHOLD) {
      add({
        id: "km",
        label: "קילומטראז'",
        explanation:
          `הרכב נסע בממוצע ${annualKm.toLocaleString()} ק"מ בשנה — מעל הממוצע הארצי (כ-15,000). קילומטראז' גבוה = שחיקה מוגברת של מנוע, תיבה ומתלים.`,
        status: "flag",
        deducted: 8,
        detail: `${annualKm.toLocaleString()} ק"מ/שנה`,
      });
    } else {
      add({
        id: "km",
        label: "קילומטראז'",
        explanation: `הרכב נסע בממוצע ${annualKm.toLocaleString()} ק"מ בשנה — בטווח הסביר ביחס לממוצע הארצי (כ-15,000).`,
        status: "ok",
        deducted: 0,
        detail: `${annualKm.toLocaleString()} ק"מ/שנה`,
      });
    }
  }

  // ─── 10. שינוי צבע ────────────────────────────────────────────
  if (vehicle.colorChanged) {
    add({
      id: "color",
      label: "שינוי צבע",
      explanation:
        "דווח שינוי צבע. צביעה מחדש יכולה להיות קוסמטית בלבד, אך לעיתים היא מלווה תיקון פחחות אחרי תאונה — שווה לשאול את המוכר.",
      status: "flag",
      deducted: 4,
      detail: "דווח שינוי",
    });
  } else {
    add({
      id: "color",
      label: "שינוי צבע",
      explanation: "לא דווח שינוי צבע — הרכב בצבעו המקורי.",
      status: "ok",
      deducted: 0,
      detail: "צבע מקורי",
    });
  }

  // ─── סיכום ────────────────────────────────────────────────────
  const totalDeducted = checks.reduce((sum, c) => sum + c.deducted, 0);
  const score = Math.max(0, 100 - totalDeducted);

  return { score, grade: gradeFor(score), checks };
}

function gradeFor(score: number): VehicleScore["grade"] {
  if (score >= 85) return { label: "מצוין", tone: "good" };
  if (score >= 70) return { label: "טוב", tone: "ok" };
  if (score >= 55) return { label: "דורש בדיקה", tone: "warn" };
  return { label: "דגלים מהותיים", tone: "bad" };
}
