import { Progress } from "@/components/ui/progress";
import type { RiskBreakdown as RiskBreakdownType, RiskTone } from "@/lib/types";
import { toneFromScore } from "@/lib/risk";

interface RiskBreakdownProps {
  breakdown: RiskBreakdownType;
  total: number;
  tone: RiskTone;
}

const ROWS: { key: keyof RiskBreakdownType; label: string; max: number }[] = [
  { key: "ownership", label: "מספר בעלויות", max: 20 },
  { key: "frequency", label: "תדירות החלפה", max: 10 },
  { key: "age", label: "גיל הרכב", max: 15 },
  { key: "test", label: "סטטוס טסט", max: 15 },
  { key: "km", label: "קילומטראז׳", max: 15 },
  { key: "structural", label: "שינוי מבנה", max: 10 },
  { key: "recalls", label: "ריקולים פתוחים", max: 10 },
  { key: "ownerType", label: "סוג בעלות", max: 5 },
];

function rowTone(value: number, max: number) {
  const ratio = value / max;
  if (ratio < 0.34) return "good" as const;
  if (ratio < 0.67) return "warn" as const;
  return "high" as const;
}

export function RiskBreakdown({ breakdown, total, tone }: RiskBreakdownProps) {
  const totalTone = tone ?? toneFromScore(total);
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2 pb-3 border-b border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-text-subtle)]">ציון כולל</span>
        <span className="text-3xl font-black tabular-nums">{total}</span>
        <span className="text-sm text-[var(--color-text-subtle)]">/ 100</span>
        <span className="ms-auto">
          {totalTone === "good" && "🟢"}
          {totalTone === "warn" && "🟡"}
          {totalTone === "high" && "🔴"}
        </span>
      </div>
      <ul className="space-y-2.5">
        {ROWS.map((row) => {
          const value = breakdown[row.key];
          return (
            <li key={row.key} className="space-y-1">
              <div className="flex items-center text-sm">
                <span className="text-[var(--color-text-muted)]">{row.label}</span>
                <span className="ms-auto tabular-nums font-medium">
                  {value} / {row.max}
                </span>
              </div>
              <Progress
                value={(value / row.max) * 100}
                tone={rowTone(value, row.max)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
