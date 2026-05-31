import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold border",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-gray-100)] text-[var(--color-gray-700)] border-transparent",
        primary: "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-100)]",
        success: "bg-[var(--color-risk-good-bg)] text-[var(--color-risk-good-text)] border-[var(--color-risk-good-border)]",
        warning: "bg-[var(--color-risk-warn-bg)] text-[var(--color-risk-warn-text)] border-[var(--color-risk-warn-border)]",
        danger: "bg-[var(--color-risk-high-bg)] text-[var(--color-risk-high-text)] border-[var(--color-risk-high-border)]",
        premium: "bg-[var(--color-tag-premium)] text-amber-800 border-amber-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
