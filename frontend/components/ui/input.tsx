import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-gray-400)] transition-colors duration-150 focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
