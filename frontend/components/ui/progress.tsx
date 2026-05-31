import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  tone?: "good" | "warn" | "high" | "primary";
}

const toneClass = {
  good: "bg-[var(--color-success)]",
  warn: "bg-[var(--color-warning)]",
  high: "bg-[var(--color-danger)]",
  primary: "bg-[var(--color-primary-500)]",
};

export function Progress({
  value,
  tone = "primary",
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[var(--color-gray-200)]",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-300", toneClass[tone])}
        style={{ inlineSize: `${clamped}%` }}
      />
    </div>
  );
}
