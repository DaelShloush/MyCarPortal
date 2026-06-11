// תצוגת ציון הרכב — מספר גדול 0-100 (גבוה = טוב) + פירוט שקוף של כל בדיקה.
// הפירוט תמיד גלוי: דגלים קודם, אחר כך בדיקות תקינות, ולבסוף "אין מידע".

import { CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import type { VehicleScore } from "@/lib/vehicle-score";

const TONE_STYLES: Record<
  VehicleScore["grade"]["tone"],
  { ring: string; text: string; bar: string }
> = {
  good: { ring: "border-[var(--color-success)]", text: "text-[var(--color-success)]", bar: "bg-[var(--color-success)]" },
  ok:   { ring: "border-[var(--color-primary-500)]", text: "text-[var(--color-primary-700)]", bar: "bg-[var(--color-primary-500)]" },
  warn: { ring: "border-[var(--color-warning)]", text: "text-[var(--color-warning)]", bar: "bg-[var(--color-warning)]" },
  bad:  { ring: "border-[var(--color-danger)]", text: "text-[var(--color-danger)]", bar: "bg-[var(--color-danger)]" },
};

interface VehicleScoreCardProps {
  result: VehicleScore;
}

export function VehicleScoreCard({ result }: VehicleScoreCardProps) {
  const { score, grade, checks } = result;
  const tone = TONE_STYLES[grade.tone];

  const flagged = checks.filter((c) => c.status === "flag");
  const passed = checks.filter((c) => c.status === "ok");
  const noData = checks.filter((c) => c.status === "na");

  return (
    <div className="space-y-4">
      {/* ── מד הציון ── */}
      <div className="flex items-center gap-4">
        <div
          className={`w-20 h-20 shrink-0 rounded-full border-4 ${tone.ring} grid place-items-center bg-white`}
          role="img"
          aria-label={`ציון רכב: ${score} מתוך 100 — ${grade.label}`}
        >
          <div className="text-center leading-none">
            <div className={`text-2xl font-black ${tone.text}`}>{score}</div>
            <div className="text-[9px] text-[var(--color-text-subtle)] mt-0.5">/ 100</div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-lg font-black ${tone.text}`}>{grade.label}</p>
          <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
            {flagged.length === 0
              ? `כל ${checks.length - noData.length} הבדיקות עברו בהצלחה`
              : `${flagged.length} מתוך ${checks.length - noData.length} בדיקות העלו ממצא`}
          </p>
          {/* פס התקדמות 0-100 */}
          <div className="mt-2 h-2 rounded-full bg-[var(--color-gray-100)] overflow-hidden" aria-hidden="true">
            <div
              className={`h-full rounded-full ${tone.bar}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── ממצאים (נוכו נקודות) ── */}
      {flagged.length > 0 && (
        <ul className="space-y-2">
          {flagged.map((c) => (
            <li
              key={c.id}
              className="p-3 rounded-lg bg-[var(--color-risk-warn-bg)] border border-[var(--color-risk-warn-border)]"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[var(--color-warning)] shrink-0" />
                <span className="text-sm font-bold text-[var(--color-risk-warn-text)] flex-1">
                  {c.label}
                  {c.detail && (
                    <span className="font-medium text-xs"> · {c.detail}</span>
                  )}
                </span>
                <span className="text-xs font-black text-[var(--color-danger)] shrink-0" dir="ltr">
                  −{c.deducted}
                </span>
              </div>
              <p className="text-xs text-[var(--color-risk-warn-text)] opacity-90 mt-1 ps-6 leading-relaxed">
                {c.explanation}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* ── בדיקות שעברו ── */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {passed.map((c) => (
          <li key={c.id} className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />
            <div className="text-sm min-w-0">
              <span className="font-medium text-[var(--color-text)]">
                {c.label}
                {c.detail && (
                  <span className="text-xs text-[var(--color-text-subtle)]"> · {c.detail}</span>
                )}
              </span>
              <p className="text-[11px] text-[var(--color-text-subtle)] leading-snug mt-0.5">
                {c.explanation}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* ── אין מידע ── */}
      {noData.length > 0 && (
        <div className="pt-2 border-t border-[var(--color-border)]">
          <ul className="space-y-1.5">
            {noData.map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
                <MinusCircle size={14} className="shrink-0" />
                <span className="font-medium">{c.label}</span>
                <span>— {c.explanation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-[var(--color-text-subtle)] leading-tight">
        ⚠️ הציון משקלל אך ורק נתונים ציבוריים ממשרד התחבורה (סטטוס, בעלויות, ריקולים,
        ק״מ מדווח). הוא אינו יודע על תאונות, תחזוקה לקויה או מצב מכני — ואינו מחליף
        בדיקה במכון מורשה לפני קנייה.
      </p>
    </div>
  );
}
