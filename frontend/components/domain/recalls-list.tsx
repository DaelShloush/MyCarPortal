import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { Recall } from "@/lib/types";

interface RecallsListProps {
  recalls: Recall[];
}

export function RecallsList({ recalls }: RecallsListProps) {
  const open = recalls.filter((r) => r.open);

  if (open.length === 0) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-risk-good-bg)] text-[var(--color-risk-good-text)]">
        <CheckCircle2 size={22} />
        <span className="font-medium text-sm">אין ריקולים פתוחים</span>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {open.map((r) => (
        <li
          key={r.id}
          className="flex gap-3 p-3 rounded-lg bg-[var(--color-risk-high-bg)] border border-[var(--color-risk-high-border)]"
        >
          <AlertTriangle
            size={20}
            className="text-[var(--color-risk-high-text)] shrink-0 mt-0.5"
          />
          <div className="text-sm">
            <p className="font-bold text-[var(--color-risk-high-text)]">
              {r.description}
            </p>
            <p className="text-xs text-[var(--color-risk-high-text)] opacity-80 mt-0.5">
              נפתח: {r.openedAt}
              {r.fix && ` · תיקון: ${r.fix}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
