import { cn } from "@/lib/utils";
import { labelFromTone, riskMessage, toneFromScore } from "@/lib/risk";
import type { RiskTone } from "@/lib/types";

interface RiskBadgeProps {
  score: number;
  tone?: RiskTone;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showMessage?: boolean;
  className?: string;
}

const toneClasses: Record<RiskTone, string> = {
  good: "risk-good",
  warn: "risk-warn",
  high: "risk-high",
};

const dotEmoji: Record<RiskTone, string> = {
  good: "🟢",
  warn: "🟡",
  high: "🔴",
};

export function RiskBadge({
  score,
  tone,
  size = "md",
  showLabel = true,
  showMessage = false,
  className,
}: RiskBadgeProps) {
  const t = tone ?? toneFromScore(score);
  const label = labelFromTone(t);

  if (size === "sm") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold",
          toneClasses[t],
          className
        )}
      >
        <span>{dotEmoji[t]}</span>
        <span>{score}/100</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-4 py-2 rounded-full border-2",
        toneClasses[t],
        className
      )}
    >
      <span className={size === "lg" ? "text-3xl font-black" : "text-2xl font-black"}>
        {score}
      </span>
      <div>
        {showLabel && (
          <div className={cn("font-bold leading-tight", size === "lg" ? "text-base" : "text-sm")}>
            {label}
          </div>
        )}
        <div className="text-xs opacity-75">{score}/100</div>
        {showMessage && (
          <div className="text-xs mt-0.5 opacity-90">{riskMessage(t)}</div>
        )}
      </div>
    </div>
  );
}
