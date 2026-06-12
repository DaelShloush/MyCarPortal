import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Section — בלוק תוכן בעמוד תוצאות (DESIGN.md §7.4)
 * סגנון אוורירי: כותרת לבנה עם אייקון בריבוע צבעוני, במקום פס כחול כבד —
 * נותן לעמוד מראה של כרטיסים נקיים על רקע אפרפר.
 */
export function Section({ title, icon, children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 rounded-xl overflow-hidden border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]", className)}>
      <header className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--color-border)]">
        {icon && (
          <span className="w-8 h-8 shrink-0 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-700)] grid place-items-center">
            {icon}
          </span>
        )}
        <span className="font-bold text-[15px] text-[var(--color-gray-900)]">{title}</span>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={cn("flex justify-between items-center gap-3 py-1.5", className)}>
      <span className="text-sm text-[var(--color-text-subtle)]">{label}</span>
      <span className="text-sm font-medium text-[var(--color-text)]">{value}</span>
    </div>
  );
}
