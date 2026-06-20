import Link from "next/link";
import { AuthRequired } from "@/components/domain/auth-required";
import {
  Car,
  Wrench,
  FileText,
  Pencil,
  Calendar,
  Gauge,
  ChevronLeft,
  Tag,
  AlertTriangle,
  ShieldCheck,
  FileSearch,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, InfoRow } from "@/components/ui/section";
import { ManufacturerLogo } from "@/components/domain/manufacturer-logo";
import { VehicleImage } from "@/components/domain/vehicle-image";
import { AddServiceDialog } from "@/components/domain/add-service-dialog";
import { RefreshVehicleButton } from "@/components/domain/refresh-vehicle-button";
import { DocumentsManager } from "@/components/domain/documents-manager";
import { SaleAdGenerator } from "@/components/domain/sale-ad-generator";
import { InsuranceEditor } from "@/components/domain/insurance-editor";
import { createClient, getUser } from "@/lib/supabase/server";
import { fetchWikiCarImage } from "@/lib/api/car-image-wiki";
import { PlateBadge } from "@/components/ui/plate-badge";
import { getManufacturerSlug } from "@/lib/manufacturer-logos";

interface VehicleDetailProps {
  params: Promise<{ id: string }>;
}

const SERVICE_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  oil: { label: "שמן", icon: "🛢️" },
  tires: { label: "צמיגים", icon: "🛞" },
  brakes: { label: "בלמים", icon: "🛑" },
  battery: { label: "מצבר", icon: "🔋" },
  ac: { label: "מזגן", icon: "❄️" },
  timing_belt: { label: "רצועת תזמון", icon: "⚙️" },
  general: { label: "טיפול כללי", icon: "🧰" },
  accident_repair: { label: "תיקון מתאונה", icon: "💥" },
  other: { label: "אחר", icon: "🔧" },
};

function daysLeft(dateStr: string | null): number {
  if (!dateStr) return 0;
  const due = new Date(dateStr);
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("he-IL");
  } catch {
    return dateStr;
  }
}

export default async function VehicleDetailPage({ params }: VehicleDetailProps) {
  const { id } = await params;
  const supabase = await createClient();

  // auth check
  const user = await getUser();
  if (!user) return <AuthRequired feature="הרכב הזה" />;

  // fetch all data in parallel
  const [vehicleRes, serviceRes, docsRes, profileRes] = await Promise.all([
    supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("service_records")
      .select("*")
      .eq("vehicle_id", id)
      .order("service_date", { ascending: false }),
    supabase
      .from("documents")
      .select("*")
      .eq("vehicle_id", id)
      .order("uploaded_at", { ascending: false }),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  const maxDocs = profileRes.data?.plan === "premium" ? 999 : 5;

  if (!vehicleRes.data) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-[920px] px-4 py-16 text-center">
          <AlertTriangle size={40} className="mx-auto mb-4 text-[var(--color-warning)]" />
          <h1 className="text-xl font-bold mb-2">הרכב לא נמצא</h1>
          <p className="text-[var(--color-text-subtle)] mb-6">
            הרכב לא קיים או שאין לך גישה אליו.
          </p>
          <Link href="/dashboard">
            <Button variant="primary">חזרה לרכבים שלי</Button>
          </Link>
        </div>
      </SiteShell>
    );
  }

  const vehicle = vehicleRes.data;
  // תמונת דגם אמיתית מוויקיפדיה (cache שבועי) — fallback ל-imagin בצד הלקוח
  const wikiImage = await fetchWikiCarImage(
    getManufacturerSlug(vehicle.manufacturer ?? ""),
    vehicle.model ?? ""
  );
  const serviceRecords = serviceRes.data ?? [];
  const documents = docsRes.data ?? [];

  const totalSpend = serviceRecords.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  const manufacturerSlug = getManufacturerSlug(vehicle.manufacturer ?? "");

  const testDays = daysLeft(vehicle.test_expiry_date);
  const insuranceDays = daysLeft(vehicle.insurance_expiry_date);

  return (
    <SiteShell>
      <div className="mx-auto max-w-[920px] px-4 md:px-6 py-4 md:py-8 space-y-6">
        {/* Breadcrumb + refresh */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <nav className="flex items-center gap-1 text-sm text-[var(--color-text-subtle)]">
            <Link href="/dashboard" className="hover:text-[var(--color-primary-600)]">
              הרכבים שלי
            </Link>
            <ChevronLeft size={14} />
            <span className="text-[var(--color-text)]">
              {vehicle.nickname || `${vehicle.manufacturer} ${vehicle.model}`}
            </span>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href={`/search/${vehicle.license_plate}`}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[var(--color-primary-700)] text-white text-sm font-bold hover:bg-[var(--color-primary-800)] transition-colors"
            >
              <FileSearch size={15} />
              דוח מלא
            </Link>
            <RefreshVehicleButton
              vehicleId={vehicle.id}
              lastSyncedAt={vehicle.last_synced_at ?? null}
            />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div className="relative">
            <VehicleImage
              manufacturer={vehicle.manufacturer ?? ""}
              model={vehicle.model ?? ""}
              fallbackSrc={wikiImage}
            />
            <div className="absolute bottom-3 start-3">
              <ManufacturerLogo
                slug={manufacturerSlug}
                name={vehicle.manufacturer ?? ""}
                size={48}
                className="shadow-[var(--shadow-md)]"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)]">
                  {vehicle.nickname ||
                    `${vehicle.manufacturer} ${vehicle.model}`}
                </h1>
                <button
                  aria-label="ערוך כינוי"
                  className="w-8 h-8 grid place-items-center rounded-lg hover:bg-[var(--color-gray-100)] text-[var(--color-text-subtle)]"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <p className="text-sm text-[var(--color-text-subtle)]">
                {vehicle.manufacturer} {vehicle.model}{" "}
                {vehicle.year && `${vehicle.year} ·`}{" "}
                <PlateBadge plate={vehicle.license_plate} size="sm" />
              </p>
            </div>
            {vehicle.owner_count != null && vehicle.owner_count > 0 && (
              <Badge variant="primary">יד {vehicle.owner_count}</Badge>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: Calendar,
              label: "טסט",
              value: testDays > 0 ? `${testDays} ימים` : "פג תוקף",
              danger: testDays < 30,
            },
            {
              icon: Calendar,
              label: "ביטוח",
              value:
                insuranceDays > 0 ? `${insuranceDays} ימים` : "אין מידע",
              danger: insuranceDays > 0 && insuranceDays < 30,
            },
            {
              icon: Gauge,
              label: "ק״מ אחרון",
              value: vehicle.km_at_last_test
                ? vehicle.km_at_last_test.toLocaleString()
                : "—",
              danger: false,
            },
            {
              icon: Tag,
              label: "סך טיפולים",
              value: `₪${totalSpend.toLocaleString()}`,
              danger: false,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="p-3">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-[var(--color-text-subtle)]" />
                  <span className="text-xs text-[var(--color-text-subtle)]">
                    {s.label}
                  </span>
                </div>
                <div
                  className={`text-lg font-black mt-1 ${
                    s.danger ? "text-[var(--color-danger)]" : ""
                  }`}
                >
                  {s.value}
                </div>
              </Card>
            );
          })}
        </div>

        {/* General info */}
        <Section title="פרטי הרכב" icon={<Car size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow label="צבע" value={vehicle.color ?? "—"} />
            <InfoRow label="דלק" value={vehicle.fuel_type ?? "—"} />
            <InfoRow
              label="ק״מ בטסט אחרון"
              value={
                vehicle.km_at_last_test
                  ? `${vehicle.km_at_last_test.toLocaleString()} ק״מ`
                  : "—"
              }
            />
            <InfoRow
              label="תאריך טסט אחרון"
              value={formatDate(vehicle.last_test_date)}
            />
            <InfoRow
              label="תוקף טסט"
              value={formatDate(vehicle.test_expiry_date)}
            />
            <InfoRow
              label="עלייה לכביש"
              value={formatDate(vehicle.first_registration_date)}
            />
            <InfoRow
              label="שינוי מבנה"
              value={vehicle.structural_change ? "כן ⚠️" : "לא ✅"}
            />
            <InfoRow
              label="שינוי צבע"
              value={vehicle.color_changed ? "כן ⚠️" : "לא ✅"}
            />
            <InfoRow
              label="ריקולים פתוחים"
              value={vehicle.has_open_recalls ? "יש ⚠️" : "אין ✅"}
            />
          </div>
        </Section>

        {/* Service history */}
        <Section title="היסטוריית טיפולים" icon={<Wrench size={16} />}>
          <div className="flex justify-between items-center mb-4 -mt-1">
            <span className="text-sm text-[var(--color-text-subtle)]">
              {serviceRecords.length} טיפולים ·{" "}
              {totalSpend > 0 ? `סך הכל ₪${totalSpend.toLocaleString()}` : ""}
            </span>
            <AddServiceDialog vehicleId={vehicle.id} />
          </div>

          {serviceRecords.length === 0 ? (
            <p className="text-sm text-[var(--color-text-subtle)] py-4 text-center">
              עוד לא הוספת טיפולים לרכב זה
            </p>
          ) : (
            <ul className="space-y-3">
              {serviceRecords.map((r) => {
                const meta =
                  SERVICE_TYPE_LABELS[r.service_type] ??
                  SERVICE_TYPE_LABELS.other;
                return (
                  <li
                    key={r.id}
                    className="flex gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-50)] grid place-items-center text-xl shrink-0">
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm">{r.title}</p>
                        {r.cost != null && r.cost > 0 && (
                          <span className="text-sm font-bold text-[var(--color-primary-700)]">
                            ₪{r.cost.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
                        {formatDate(r.service_date)}
                        {r.km_at_service
                          ? ` · ${r.km_at_service.toLocaleString()} ק״מ`
                          : ""}
                        {r.garage_name ? ` · ${r.garage_name}` : ""}
                      </p>
                      {r.description && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          {r.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* Documents */}
        <Section title="מסמכים" icon={<FileText size={16} />}>
          <DocumentsManager
            vehicleId={vehicle.id}
            userId={user.id}
            initialDocs={documents}
            maxDocs={maxDocs}
          />
        </Section>

        {/* Insurance details */}
        <Section title="ביטוח" icon={<ShieldCheck size={16} />}>
          <InsuranceEditor
            vehicleId={vehicle.id}
            expiryDate={vehicle.insurance_expiry_date ?? null}
            cost={vehicle.insurance_cost ?? null}
          />
        </Section>

        {/* Sale ad generator */}
        <Section title="מחולל מודעת מכירה" icon={<Tag size={16} />}>
          <SaleAdGenerator
            base={{
              manufacturer: vehicle.manufacturer ?? "",
              model: vehicle.model ?? "",
              year: vehicle.year ?? null,
              color: vehicle.color ?? null,
              fuelType: vehicle.fuel_type ?? null,
              ownerCount: vehicle.owner_count ?? null,
              km: vehicle.km_at_last_test ?? null,
              testExpiry: vehicle.test_expiry_date ?? null,
              structuralChange: vehicle.structural_change ?? null,
              hasOpenRecalls: vehicle.has_open_recalls ?? null,
            }}
          />
        </Section>
      </div>
    </SiteShell>
  );
}
