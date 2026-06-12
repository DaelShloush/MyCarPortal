import { cn } from "@/lib/utils";

// פורמט לוחית ישראלית: 8 ספרות → XXX-XX-XXX · 7 ספרות → XX-XXX-XX
function formatIsraeliPlate(plate: string): string {
  const d = plate.replace(/\D/g, "");
  if (d.length === 8) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  if (d.length === 7) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
  if (d.length === 6) return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
  return d;
}

interface PlateBadgeProps {
  plate: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * PlateBadge — מספר רישוי בעיצוב לוחית ישראלית אמיתית:
 * פס כחול עם IL + רקע צהוב + ספרות עם מקפים.
 */
export function PlateBadge({ plate, size = "md", className }: PlateBadgeProps) {
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-md border border-black/25 shadow-[var(--shadow-sm)] align-middle select-all",
        className
      )}
      aria-label={`מספר רישוי ${plate}`}
    >
      <span
        className={cn(
          "bg-[#2A4DA7] text-white font-bold grid place-items-center leading-none",
          size === "md" ? "px-1.5 text-[9px]" : "px-1 text-[8px]"
        )}
        aria-hidden="true"
      >
        IL
      </span>
      <span
        className={cn(
          "plate-text bg-[#FFD320] text-black font-black tracking-wide leading-none grid place-items-center",
          size === "md" ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs"
        )}
      >
        {formatIsraeliPlate(plate)}
      </span>
    </span>
  );
}
