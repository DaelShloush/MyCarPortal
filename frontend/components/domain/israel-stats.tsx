// "רכבים בישראל במספרים" — סטטיסטיקות חיות מ-data.gov.il לעמוד הבית.
// רכיב שרת אסינכרוני: נטען בתוך <Suspense> כדי לא לעכב את ה-hero,
// ואם ה-API לא זמין — נופל בשקט לסטריפ הסטטי הישן.

import {
  BarChart3,
  Zap,
  CalendarPlus,
  Car,
  AlertTriangle,
  CarTaxiFront,
  Accessibility,
  Recycle,
} from "lucide-react";
import { fetchIsraelStats } from "@/lib/api/israel-stats";

const fmt = (n: number) => n.toLocaleString("he-IL");

/** הסטריפ הסטטי המקורי — משמש גם כ-fallback בזמן טעינה וגם כשה-API נופל */
export function StatsStripFallback() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 grid grid-cols-3 gap-4">
        {[
          { num: "4.1M", label: "רכבים פעילים" },
          { num: "14", label: "מאגרי מידע" },
          { num: "30 שנה", label: "היסטוריה" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl md:text-3xl font-black text-[var(--color-primary-700)]">
              {s.num}
            </div>
            <div className="text-xs md:text-sm text-[var(--color-text-subtle)] mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function IsraelStatsSection() {
  const stats = await fetchIsraelStats();
  if (!stats) return <StatsStripFallback />;

  const headline = [
    {
      icon: Car,
      num: fmt(stats.totalActive),
      label: "רכבים פעילים בישראל",
    },
    {
      icon: Zap,
      num: fmt(stats.electricCount),
      label: "רכבים חשמליים",
    },
    {
      icon: BarChart3,
      num: fmt(stats.hybridCount),
      label: "היברידיים נטענים",
    },
    {
      icon: CalendarPlus,
      num: fmt(stats.lastYearCount),
      label: `עלו לכביש מדגם ${stats.currentYear - 1}`,
    },
  ];

  const maxFuelPct = Math.max(...stats.fuels.map((f) => f.pct), 1);
  const maxEvPct = Math.max(...stats.evTrend.map((y) => y.pct), 1);
  const maxBrand = Math.max(...stats.topBrands.map((b) => b.count), 1);

  const facts = [
    {
      icon: AlertTriangle,
      num: fmt(stats.openRecalls),
      label: "רכבים עם ריקול פתוח — בדקו אם שלכם ביניהם",
    },
    {
      icon: CarTaxiFront,
      num: fmt(stats.activeTaxis),
      label: "מוניות פעילות על הכביש",
    },
    {
      icon: Accessibility,
      num: fmt(stats.disabilityTags),
      label: "רכבים עם תג נכה",
    },
    {
      icon: Recycle,
      num: fmt(stats.everRemoved),
      label: "ירדו מהכביש אי-פעם (גריטה/השבתה)",
    },
  ];

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
          <h2 className="text-xl md:text-2xl font-black text-[var(--color-gray-900)]">
            רכבים בישראל במספרים
          </h2>
          <p className="text-xs text-[var(--color-text-subtle)]">
            נתונים חיים ממאגרי משרד התחבורה · מתעדכן יומית
          </p>
        </div>

        {/* ── מספרי כותרת ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {headline.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl bg-white border border-[var(--color-border)] p-4 text-center"
              >
                <Icon
                  size={18}
                  className="mx-auto mb-1.5 text-[var(--color-primary-600)]"
                  aria-hidden="true"
                />
                <div className="text-xl md:text-2xl font-black text-[var(--color-primary-700)]">
                  {s.num}
                </div>
                <div className="text-[11px] md:text-xs text-[var(--color-text-subtle)] mt-0.5">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── התפלגות סוגי הנעה ── */}
          <div className="rounded-xl bg-white border border-[var(--color-border)] p-5">
            <h3 className="font-bold text-sm mb-4">התפלגות סוגי הנעה</h3>
            <ul className="space-y-3">
              {stats.fuels.map((f) => {
                const isElectric = f.label === "חשמלי";
                return (
                  <li key={f.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-[var(--color-text)]">
                        {f.label}
                      </span>
                      <span className="text-[var(--color-text-subtle)]">
                        {fmt(f.count)} · {f.pct}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full bg-[var(--color-gray-100)] overflow-hidden"
                      role="img"
                      aria-label={`${f.label}: ${f.pct} אחוז`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          isElectric
                            ? "bg-[var(--color-success)]"
                            : "bg-[var(--color-primary-500)]"
                        }`}
                        style={{ width: `${Math.max(2, (f.pct / maxFuelPct) * 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── הדגמים הנפוצים על הכביש ── */}
          <div className="rounded-xl bg-white border border-[var(--color-border)] p-5">
            <h3 className="font-bold text-sm mb-4">הדגמים הנפוצים ביותר על הכביש</h3>
            <ol className="space-y-2.5">
              {stats.topModels.map((m, i) => (
                <li key={m.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] grid place-items-center text-xs font-black">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      {m.name}
                    </span>
                    <span className="text-xs text-[var(--color-text-subtle)] ms-2">
                      {m.manufacturer}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[var(--color-text-subtle)] shrink-0">
                    {fmt(m.count)} רכבים
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── מהפכת החשמל — אחוז חשמליים לפי שנתון ── */}
          {stats.evTrend.length > 0 && (
            <div className="rounded-xl bg-white border border-[var(--color-border)] p-5">
              <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                <Zap size={15} className="text-[var(--color-success)]" aria-hidden="true" />
                מהפכת החשמל — אחוז חשמליים מכל שנתון
              </h3>
              <p className="text-[11px] text-[var(--color-text-subtle)] mb-4">
                כמה מהרכבים שעלו לכביש בכל שנה הם חשמליים מלאים
              </p>
              <div className="flex items-end gap-1.5 h-28">
                {stats.evTrend.map((y) => (
                  <div
                    key={y.year}
                    className="flex-1 h-full flex flex-col justify-end items-center min-w-0"
                    role="img"
                    aria-label={`${y.year}: ${y.pct} אחוז חשמליים`}
                  >
                    <span className="text-[10px] font-black text-[var(--color-success)] mb-0.5">
                      {y.pct}%
                    </span>
                    <div
                      className="w-full max-w-9 rounded-t-md bg-[var(--color-success)] opacity-90"
                      style={{ height: `${Math.max(3, (y.pct / maxEvPct) * 78)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-1 border-t border-[var(--color-border)] pt-1">
                {stats.evTrend.map((y) => (
                  <div
                    key={y.year}
                    className="flex-1 text-center text-[10px] text-[var(--color-text-subtle)]"
                  >
                    {y.year}
                    {y.year === stats.currentYear ? "*" : ""}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[var(--color-text-subtle)] mt-2">
                * {stats.currentYear} — שנה חלקית (עד היום)
              </p>
            </div>
          )}

          {/* ── המותגים המובילים ── */}
          {stats.topBrands.length > 0 && (
            <div className="rounded-xl bg-white border border-[var(--color-border)] p-5">
              <h3 className="font-bold text-sm mb-4">המותגים המובילים בישראל</h3>
              <ul className="space-y-3">
                {stats.topBrands.map((b, i) => (
                  <li key={b.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[var(--color-text)]">
                        {i + 1}. {b.name}
                      </span>
                      <span className="text-[var(--color-text-subtle)]">
                        {fmt(b.count)} רכבים
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full bg-[var(--color-gray-100)] overflow-hidden"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full bg-[var(--color-primary-600)]"
                        style={{ width: `${Math.max(3, (b.count / maxBrand) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-[var(--color-text-subtle)] mt-3">
                לפי כמות רכבים פעילים, מצרף את כל הדגמים וארצות הייצור של המותג
              </p>
            </div>
          )}
        </div>

        {/* ── עוד מספרים מעניינים ── */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {facts.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="rounded-xl bg-white border border-[var(--color-border)] p-4 flex items-start gap-3"
              >
                <span className="w-9 h-9 shrink-0 rounded-lg bg-[var(--color-primary-50)] grid place-items-center text-[var(--color-primary-600)]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="text-lg font-black text-[var(--color-gray-900)] leading-tight">
                    {f.num}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-subtle)] leading-snug mt-0.5">
                    {f.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
