import Link from "next/link";
import { AuthRequired } from "@/components/domain/auth-required";
import { Plus, Crown } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/domain/vehicle-card";
import { AlertBanner } from "@/components/domain/alert-banner";
import { createClient } from "@/lib/supabase/server";
import { getManufacturerSlug } from "@/lib/manufacturer-logos";
import { upgradeToPremiumAction } from "@/app/actions/profile";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <AuthRequired feature="הרכבים שלך" />;

  const [vehiclesRes, remindersRes, profileRes] = await Promise.all([
    supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false }),
    supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .gte("due_date", new Date().toISOString().split("T")[0])
      .order("due_date", { ascending: true })
      .limit(5),
    supabase
      .from("profiles")
      .select("name, plan")
      .eq("id", user.id)
      .single(),
  ]);

  const vehicles = vehiclesRes.data ?? [];
  const reminders = remindersRes.data ?? [];
  const profile = profileRes.data;
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "משתמש";
  const isPremium = profile?.plan === "premium";

  function daysLeft(dueDateStr: string) {
    const due = new Date(dueDateStr);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  function reminderTone(days: number): "info" | "warn" | "high" {
    if (days <= 14) return "high";
    if (days <= 30) return "warn";
    return "info";
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)]">
              שלום, {userName} 👋
            </h1>
            <p className="text-sm text-[var(--color-text-subtle)] mt-1">
              {vehicles.length} רכבים בניהול שלך
            </p>
          </div>
          <Link href="/">
            <Button>
              <Plus size={18} />
              הוסף רכב
            </Button>
          </Link>
        </div>

        {/* Reminders */}
        {reminders.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-[var(--color-text-muted)] mb-3 uppercase tracking-wide">
              תזכורות פעילות
            </h2>
            <div className="space-y-2">
              {reminders.map((r) => {
                const days = daysLeft(r.due_date);
                return (
                  <AlertBanner
                    key={r.id}
                    tone={reminderTone(days)}
                    title={r.title ?? (r.type === "test" ? "טסט מתקרב" : "ביטוח מתקרב")}
                    description={`תוקף: ${r.due_date} · ${days} ימים נותרו`}
                    href={`/vehicle/${r.vehicle_id}`}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Vehicles */}
        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-muted)] mb-3 uppercase tracking-wide">
            הרכבים שלי
          </h2>
          {vehicles.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-text-subtle)]">
              <p className="mb-4">עוד לא הוספת רכבים לניהול</p>
              <Link href="/">
                <Button variant="primary">חפש רכב להוספה</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={{
                    id: v.id,
                    plate: v.license_plate,
                    manufacturer: v.manufacturer ?? "",
                    manufacturerSlug: getManufacturerSlug(v.manufacturer ?? ""),
                    manufacturerCountry: "",
                    model: v.model ?? "",
                    year: v.year ?? 0,
                    color: v.color ?? "",
                    fuelType: v.fuel_type ?? "",
                    yad: v.owner_count ?? 0,
                    testExpiryDate: v.test_expiry_date ?? "",
                    insuranceExpiryDate: v.insurance_expiry_date ?? "",
                    daysToTestExpiry: v.test_expiry_date
                      ? daysLeft(v.test_expiry_date)
                      : 0,
                    daysToInsuranceExpiry: v.insurance_expiry_date
                      ? daysLeft(v.insurance_expiry_date)
                      : 0,
                    nickname: v.nickname ?? undefined,
                    // required Vehicle fields (minimal)
                    engineCC: 0, horsepower: 0, drivetrain: "", gearbox: "",
                    bodyType: "", doors: 0, seats: 0, weightKg: 0, towingKg: 0,
                    firstRegistrationDate: "", testLastDate: "",
                    kmAtLastTest: v.km_at_last_test ?? 0,
                    structuralChange: v.structural_change ?? false,
                    colorChanged: v.color_changed ?? false,
                    towHook: false, tireChanged: false,
                    owners: [], recalls: [],
                    safety: { airbags: 0, abs: false, esp: false, laneAssist: false,
                      collisionWarning: false, pedestrianDetect: false, reverseCamera: false,
                      emergencyBrake: false, blindSpot: false, autoLights: false, safetyScore: 0 },
                    greenScore: 0, pollutionGroup: 0, co2: 0, nox: 0,
                    tireFront: "", tireRear: "", loadFront: 0, speedRating: "",
                    hasDisabilityTag: false,
                  } as Parameters<typeof VehicleCard>[0]["vehicle"]}
                />
              ))}

              {/* Add new card — only if under limit */}
              {(isPremium ? vehicles.length < 3 : vehicles.length < 1) && (
                <Link
                  href="/"
                  className="border-2 border-dashed border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center p-8 text-[var(--color-text-subtle)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)] transition-colors min-h-[260px]"
                >
                  <Plus size={32} className="mb-2" />
                  <span className="font-bold">הוסף רכב חדש</span>
                  <span className="text-xs mt-1">חיפוש לפי מספר רישוי</span>
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Premium CTA */}
        {!isPremium && (
          <section className="mt-10">
            <div className="rounded-2xl bg-gradient-to-br from-[var(--color-tag-premium)] to-amber-100 border border-amber-200 p-6 flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 grid place-items-center text-white shrink-0">
                <Crown size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-amber-900">שדרג ל-Premium</h3>
                <p className="text-sm text-amber-800">
                  עד 3 רכבים, מסמכים והיסטוריה ללא הגבלה, הפקת PDF, וללא פרסומות — ב-₪9.90 לחודש.
                </p>
              </div>
              <form action={upgradeToPremiumAction}>
                <Button type="submit" variant="primary" className="bg-amber-600 hover:bg-amber-700">
                  שדרוג ב-₪9.90
                </Button>
              </form>
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  );
}
