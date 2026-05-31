import type { RiskTone } from "./types";

export function toneFromScore(score: number): RiskTone {
  if (score <= 33) return "good";
  if (score <= 66) return "warn";
  return "high";
}

export function labelFromTone(tone: RiskTone): string {
  if (tone === "good") return "נראה טוב";
  if (tone === "warn") return "יש מה לבדוק";
  return "סיכון גבוה";
}

export function riskMessage(tone: RiskTone): string {
  if (tone === "good") return "הנתונים נראים תקינים";
  if (tone === "warn") return "יש נקודות שדורשות תשומת לב";
  return "מומלץ בחום לבצע בדיקה מקיפה";
}

export function emojiFromTone(tone: RiskTone): string {
  return tone === "good" ? "🟢" : tone === "warn" ? "🟡" : "🔴";
}
