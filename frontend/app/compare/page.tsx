import Link from "next/link";
import { Scale, ChevronLeft } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { ManufacturerLogo } from "@/components/domain/manufacturer-logo";
import { fetchVehicleByPlate } from "@/lib/api/vehicle-aggregator";
import { estimateCurrentValue } from "@/lib/value-estimator";
import { estimateCosts } from "@/lib/cost-estimator";
import { createClient } from "@/lib/supabase/server";
import type { Vehicle } from "@/lib/types";

interface ComparePageProps {
  searchParams: Promise<{ plates?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { plates: platesParam } = await searchParams;

  // מגבלת השוואה — חינם עד 2, פרמיום עד 4
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    isPremium = profile?.plan === "premium";
  }
  const MAX = isPremium ? 4 : 2;

  const plates = (platesParam ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter((p) => /^\d{5,8}$/.test(p))
    .slice(0, MAX);

  // מצב ריק
  if (plates.length < 2) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-[920px] px-4 py-16 text-center">
          <Scale size={40} className="mx-auto mb-4 text-[var(--color-primary-400)]" />
          <h1 className="text-xl font-bold mb-2">השוואת רכבים</h1>
          <p className="text-[var(--color-text-subtle)] mb-6">
            כדי להשוות, בחר לפחות 2 רכבים מרשימת המועדפים שלך.
          </p>
          <Link href="/favorites">
            <Button variant="primary">למועדפים</Button>
          </Link>
        </div>
      </SiteShell>
    );
  }

  const results = await Promise.all(
    plates.map(async (plate) => {
      try {
        const r = await fetchVehicleByPlate(plate);
        return { plate, vehicle: r?.vehicle ?? null };
      } catch {
        return { plate, vehicle: null };
      }
    })
  );

  const found = results.filter((r) => r.vehicle) as {
    plate: string;
    vehicle: Vehicle;
  }[];

  if (found.length === 0) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-[920px] px-4 py-16 text-center">
          <h1 className="text-xl font-bold mb-2">לא נמצאו נתונים</h1>
          <Link href="/favorites" className="text-[var(--color-primary-600)] hover:underline">
            ← חזרה למועדפים
          </Link>
        </div>
      </SiteShell>
    );
  }

  const fmt = (n: number | undefined, suffix = "") =>
    n && n > 0 ? `${n.toLocaleString()}${suffix}` : "—";

  // שורות ההשוואה
  const rows: { label: string; render: (v: Vehicle) => React.ReactNode }[] = [
    { label: "שנת ייצור", render: (v) => v.year || "—" },
    { label: "יד (בעלים)", render: (v) => (v.yad > 0 ? v.yad : "—") },
    { label: 'ק"מ אחרון', render: (v) => fmt(v.kmAtLastTest) },
    {
      label: "מחיר מחירון מקורי",
      render: (v) => (v.originalPrice ? `₪${v.originalPrice.toLocaleString()}` : "—"),
    },
    {
      label: "שווי נוכחי משוער",
      render: (v) => {
        const e = estimateCurrentValue(v.originalPrice, v.year, v.kmAtLastTest);
        return e ? `₪${e.mid.toLocaleString()}` : "—";
      },
    },
    {
      label: "עלות שנתית משוערת",
      render: (v) => {
        const c = estimateCosts(v);
        return c?.annualTotal ? `₪${c.annualTotal.toLocaleString()}` : "—";
      },
    },
    { label: "נפח מנוע", render: (v) => fmt(v.engineCC, ' סמ"ק') },
    { label: "כוח סוס", render: (v) => fmt(v.horsepower, ' כ"ס') },
    { label: "תיבת הילוכים", render: (v) => v.gearbox || "—" },
    {
      label: "רמת אבזור בטיחותי",
      render: (v) =>
        v.safety.equipLevel ? `${v.safety.equipLevel} / 8` : "—",
    },
    { label: "כריות אוויר", render: (v) => fmt(v.safety.airbags) },
    {
      label: "ריקולים פתוחים",
      render: (v) => {
        const open = v.recalls.filter((r) => r.open).length;
        return open > 0 ? (
          <span className="text-[var(--color-danger)] font-bold">{open}</span>
        ) : (
          <span className="text-[var(--color-success)]">אין</span>
        );
      },
    },
    { label: "רישיון בתוקף עד", render: (v) => v.testExpiryDate || "—" },
  ];

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 py-6 md:py-10">
        <nav className="flex items-center gap-1 text-sm text-[var(--color-text-subtle)] mb-4">
          <Link href="/favorites" className="hover:text-[var(--color-primary-600)]">
            מועדפים
          </Link>
          <ChevronLeft size={14} />
          <span className="text-[var(--color-text)]">השוואה</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)] mb-6 flex items-center gap-2">
          <Scale size={26} />
          השוואת רכבים ({found.length})
        </h1>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr>
                <th className="sticky start-0 bg-[var(--color-bg-subtle)] p-3 text-start text-xs font-bold text-[var(--color-text-subtle)] z-10">
                  השוואה
                </th>
                {found.map((f) => (
                  <th key={f.plate} className="p-3 text-center align-top bg-[var(--color-bg-subtle)] min-w-[150px]">
                    <Link href={`/search/${f.plate}`} className="block hover:opacity-80">
                      <ManufacturerLogo
                        slug={f.vehicle.manufacturerSlug}
                        name={f.vehicle.manufacturer}
                        size={36}
                        className="mx-auto mb-1"
                      />
                      <p className="font-bold text-[var(--color-gray-900)] leading-tight">
                        {f.vehicle.manufacturer} {f.vehicle.model}
                      </p>
                      <p className="text-xs text-[var(--color-text-subtle)] plate-text">
                        {f.plate}
                      </p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-[var(--color-bg-subtle)]/40" : ""}
                >
                  <th className="sticky start-0 bg-inherit p-3 text-start text-xs font-medium text-[var(--color-text-subtle)] z-10 whitespace-nowrap">
                    {row.label}
                  </th>
                  {found.map((f) => (
                    <td key={f.plate} className="p-3 text-center text-[var(--color-text)]">
                      {row.render(f.vehicle)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[var(--color-text-subtle)] mt-3 leading-tight">
          שווי ועלות שנתית הם הערכות משוערות בלבד ואינם מחליפים בדיקה פיזית.
        </p>
      </div>
    </SiteShell>
  );
}
