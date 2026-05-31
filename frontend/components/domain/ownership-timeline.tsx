import type { Owner } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OwnershipTimelineProps {
  owners: Owner[];
}

export function OwnershipTimeline({ owners }: OwnershipTimelineProps) {
  return (
    <div className="relative ps-6">
      {/* קו ציר אנכי */}
      <div
        className="absolute top-2 bottom-2 w-0.5 bg-[var(--color-gray-200)]"
        style={{ insetInlineStart: "5px" }}
      />
      <ul className="space-y-4">
        {owners.map((owner, i) => {
          const isCurrent = owner.current ?? i === owners.length - 1;
          const isDealer = owner.type === "סוחר";
          return (
            <li key={i} className="relative">
              <span
                className={cn(
                  "absolute w-3 h-3 rounded-full border-2 border-white shadow",
                  isCurrent
                    ? "bg-[var(--color-success)]"
                    : isDealer
                    ? "bg-[var(--color-warning)]"
                    : "bg-[var(--color-primary-500)]"
                )}
                style={{ insetInlineStart: "-23px", top: "4px" }}
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className="text-sm text-[var(--color-text-subtle)] tabular-nums plate-text">
                  {owner.date}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isDealer && "text-[var(--color-warning)]",
                    isCurrent && "text-[var(--color-success)] font-bold"
                  )}
                >
                  {owner.type}
                  {isCurrent && " ← בעלים נוכחי"}
                </span>
                {owner.durationMonths && (
                  <span className="text-xs text-[var(--color-text-subtle)]">
                    ({owner.durationMonths} חודשים)
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
