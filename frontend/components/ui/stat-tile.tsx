import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  className?: string;
}

/**
 * StatTile — אריח נתון קומפקטי (אייקון + ערך + תווית).
 * משמש להצגה ויזואלית של נתוני מפתח במקום שורות "תווית: ערך".
 */
export function StatTile({ icon, value, label, className }: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-white p-3 text-center",
        className
      )}
    >
      {icon && (
        <span className="mx-auto mb-1.5 w-8 h-8 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-600)] grid place-items-center">
          {icon}
        </span>
      )}
      <div className="text-sm font-black text-[var(--color-gray-900)] leading-tight break-words">
        {value}
      </div>
      <div className="text-[11px] text-[var(--color-text-subtle)] mt-0.5 leading-tight">
        {label}
      </div>
    </div>
  );
}

interface ScaleBarProps {
  value: number;
  max: number;
  label: string;
  /** true = ערך נמוך הוא טוב (קבוצת זיהום, מדד ירוק) */
  lowIsGood?: boolean;
  hint?: string;
}

/**
 * ScaleBar — סולם ויזואלי צבעוני (ירוק→כתום→אדום) לציונים כמו
 * קבוצת זיהום ומדד ירוק, במקום טקסט "8/15".
 */
export function ScaleBar({ value, max, label, lowIsGood = true, hint }: ScaleBarProps) {
  const ratio = Math.max(0, Math.min(1, value / max));
  const goodness = lowIsGood ? 1 - ratio : ratio; // 1 = הכי טוב
  const color =
    goodness >= 0.66
      ? "bg-[var(--color-success)]"
      : goodness >= 0.33
        ? "bg-[var(--color-warning)]"
        : "bg-[var(--color-danger)]";

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-[var(--color-text-subtle)]">{label}</span>
        <span className="font-bold text-[var(--color-text)]">
          {value} <span className="text-xs font-medium text-[var(--color-text-subtle)]">/ {max}</span>
        </span>
      </div>
      <div
        className="h-2.5 rounded-full bg-[var(--color-gray-100)] overflow-hidden"
        role="img"
        aria-label={`${label}: ${value} מתוך ${max}`}
      >
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.max(4, ratio * 100)}%` }}
        />
      </div>
      {hint && (
        <p className="text-[10px] text-[var(--color-text-subtle)] mt-1">{hint}</p>
      )}
    </div>
  );
}
