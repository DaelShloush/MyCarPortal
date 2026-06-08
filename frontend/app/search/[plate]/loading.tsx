import { Car } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";

export default function SearchLoading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-[920px] px-4 min-h-[68vh] flex flex-col items-center justify-center text-center">
        {/* לוגו + טבעת מסתובבת */}
        <div className="relative w-28 h-28 grid place-items-center mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-primary-100)] border-t-[var(--color-primary-600)] animate-spin" />
          <div className="mcp-drive w-16 h-16 rounded-2xl bg-[var(--color-primary-700)] grid place-items-center text-white shadow-[var(--shadow-md)]">
            <Car size={32} strokeWidth={2.5} />
          </div>
        </div>

        {/* שם המותג */}
        <span className="text-xl font-black text-[var(--color-gray-900)]">
          MyCarPortal
        </span>

        {/* פס "כביש" נע */}
        <div className="mcp-road mt-5 h-1.5 w-48 rounded-full" aria-hidden />

        {/* הודעת טעינה עם נקודות מונפשות */}
        <p className="mt-5 text-sm font-medium text-[var(--color-gray-700)]" aria-live="polite">
          טוען נתונים ממאגרי משרד התחבורה
          <span className="mcp-dot">.</span>
          <span className="mcp-dot" style={{ animationDelay: "0.2s" }}>.</span>
          <span className="mcp-dot" style={{ animationDelay: "0.4s" }}>.</span>
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
          שולף מ-6 מאגרים במקביל — עוד רגע
        </p>
      </div>
    </SiteShell>
  );
}
