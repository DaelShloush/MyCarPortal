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
 * כותרת על רקע primary-700 + תוכן בכרטיס
 */
export function Section({ title, icon, children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 rounded-xl overflow-hidden border border-[var(--color-border)] bg-white", className)}>
      <header className="flex items-center gap-2 bg-[var(--color-primary-700)] text-white px-4 py-3 font-bold text-sm">
        {icon && <span className="opacity-80">{icon}</span>}
        <span>{title}</span>
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
