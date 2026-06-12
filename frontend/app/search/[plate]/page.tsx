import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Info,
  Cog,
  Users,
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck,
  Leaf,
  Disc3,
  ExternalLink,
  Tag,
  Wallet,
  AirVent,
  CarTaxiFront,
  Gauge,
  Zap,
  Fuel,
  CalendarDays,
  CarFront,
  DoorOpen,
  Armchair,
  Weight,
  Caravan,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Section, InfoRow } from "@/components/ui/section";
import { StatTile, ScaleBar } from "@/components/ui/stat-tile";
import { Badge } from "@/components/ui/badge";
import { VehicleImage } from "@/components/domain/vehicle-image";
import { ManufacturerLogo } from "@/components/domain/manufacturer-logo";
import { OwnershipTimeline } from "@/components/domain/ownership-timeline";
import { RecallsList } from "@/components/domain/recalls-list";
import { SafetyGrid } from "@/components/domain/safety-grid";
import { SearchActions } from "@/components/domain/search-actions";
import { SearchHistoryTracker } from "@/components/domain/search-history-tracker";
import { CompareInput } from "@/components/domain/compare-input";
import { SectionNav } from "@/components/domain/section-nav";
import { VehicleScoreCard } from "@/components/domain/vehicle-score";
import { computeVehicleScore } from "@/lib/vehicle-score";
import { fetchVehicleByPlate } from "@/lib/api/vehicle-aggregator";
import { getUser } from "@/lib/supabase/server";
import { isFavoriteAction } from "@/app/actions/favorites";
import { estimateCurrentValue } from "@/lib/value-estimator";
import { estimateCosts } from "@/lib/cost-estimator";
import { buildCarImageUrl } from "@/lib/car-image";

interface SearchPageProps {
  params: Promise<{ plate: string }>;
}

// עטיפת cache — generateMetadata והעמוד חולקים שליפה אחת לכל בקשה
const getVehicle = cache((plate: string) => fetchVehicleByPlate(plate));

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { plate } = await params;
  if (!plate || !/^\d{5,8}$/.test(plate)) {
    return { title: "חיפוש רכב | MyCarPortal" };
  }

  let result: Awaited<ReturnType<typeof fetchVehicleByPlate>> = null;
  try {
    result = await getVehicle(plate);
  } catch {
    /* נשתמש בכותרת ברירת מחדל */
  }

  if (!result) {
    return {
      title: `רכב ${plate} לא נמצא | MyCarPortal`,
      description: "מספר הרישוי לא נמצא במאגרי משרד התחבורה.",
    };
  }

  const { vehicle } = result;
  const name = `${vehicle.manufacturer} ${vehicle.model} ${vehicle.year || ""}`.trim();
  const title = `${name} — בדיקת רכב | MyCarPortal`;
  const bits = [
    vehicle.fuelType,
    vehicle.testExpiryDate ? `טסט בתוקף עד ${vehicle.testExpiryDate}` : null,
    vehicle.recalls?.some((r) => r.open) ? "⚠️ ריקול פתוח" : null,
  ].filter(Boolean);
  const description =
    `בדיקת ${name} (${plate}) — היסטוריית בעלויות, טסט, ריקולים, בטיחות והערכת שווי ממאגרי משרד התחבורה.` +
    (bits.length ? ` ${bits.join(" · ")}.` : "");

  const image = buildCarImageUrl({
    manufacturer: vehicle.manufacturer,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    width: 1200,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "he_IL",
      siteName: "MyCarPortal",
      images: image ? [{ url: image, width: 1200, height: 675, alt: name }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { plate } = await params;

  if (!plate || !/^\d{5,8}$/.test(plate)) notFound();

  let result: Awaited<ReturnType<typeof fetchVehicleByPlate>> = null;
  let apiError = false;

  try {
    result = await getVehicle(plate);
  } catch {
    apiError = true;
  }

  if (apiError) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-[920px] px-4 md:px-6 py-16 text-center space-y-4">
          <AlertTriangle size={48} className="mx-auto text-[var(--color-warning)]" />
          <h1 className="text-2xl font-bold">שגיאה בטעינת הנתונים</h1>
          <p className="text-[var(--color-text-subtle)]">לא ניתן להתחבר למסד הנתונים הממשלתי. אנא נסה שוב בעוד מספר שניות.</p>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary-600)] hover:underline">← חזרה לחיפוש</Link>
        </div>
      </SiteShell>
    );
  }

  if (!result) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-[920px] px-4 md:px-6 py-16 text-center space-y-4">
          <Info size={48} className="mx-auto text-[var(--color-primary-400)]" />
          <h1 className="text-2xl font-bold">הרכב לא נמצא</h1>
          <p className="text-[var(--color-text-subtle)]">מספר רישוי <span className="plate-text font-bold">{plate}</span> לא נמצא במאגרי הנתונים הרשמיים.</p>
          <p className="text-sm text-[var(--color-text-subtle)]">ייתכן שהרכב לא רשום בישראל, מספר הרישוי שגוי, או שמדובר ברכב היסטורי שאינו במאגר.</p>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary-600)] hover:underline">← חזרה לחיפוש</Link>
        </div>
      </SiteShell>
    );
  }

  const { vehicle, source } = result;

  const summary = {
    manufacturer: vehicle.manufacturer,
    model: vehicle.model,
    year: vehicle.year,
  };

  const currentYear = new Date().getFullYear();
  // רכב פרטי פטור ממבחן רישוי (טסט) ב-3 השנים הראשונות → ה"טסט האחרון" הוא למעשה הרישום הראשוני
  const vehicleAge = vehicle.year ? currentYear - vehicle.year : 99;
  const noPeriodicTestYet = vehicleAge < 3;
  const valueEstimate = estimateCurrentValue(
    vehicle.originalPrice,
    vehicle.year,
    vehicle.kmAtLastTest
  );
  const costs = estimateCosts(vehicle);
  // תוקף טסט — מחושב בשכבת הנתונים (vehicle-aggregator), לא בזמן render
  const testExpired = vehicle.testExpired;

  // ===== פופולריות ואמינות הדגם =====
  const depreciationPct =
    vehicle.originalPrice && valueEstimate
      ? Math.round((1 - valueEstimate.mid / vehicle.originalPrice) * 100)
      : null;

  const totalEverMade =
    vehicle.modelActiveCount != null && vehicle.modelInactiveCount != null
      ? vehicle.modelActiveCount + vehicle.modelInactiveCount
      : 0;
  const survivalPct =
    totalEverMade > 0 ? Math.round((vehicle.modelActiveCount! / totalEverMade) * 100) : null;

  const popularity = (() => {
    const n = vehicle.modelActiveCount;
    if (n == null) return null;
    if (n >= 50000) return { label: "נפוץ מאוד", variant: "success" as const };
    if (n >= 10000) return { label: "נפוץ", variant: "success" as const };
    if (n >= 2000) return { label: "נפוצות בינונית", variant: "default" as const };
    return { label: "נדיר", variant: "warning" as const };
  })();

  // דגל "בעלויות קצרות" — בעלים פרטיים שהחזיקו ברכב פחות משנה (סוחר מחזיק קצר באופן טבעי)
  const shortOwnerships = vehicle.owners.filter(
    (o) => o.type === "פרטי" && o.durationMonths != null && o.durationMonths < 12
  ).length;

  // האם קבוצת "שווי ועלויות" תוצג בכלל (רכבים ישנים ללא מפרט/מחירון — לא)
  const hasValueGroup =
    !!vehicle.originalPrice ||
    !!costs ||
    vehicle.modelActiveCount != null ||
    depreciationPct != null;

  // ציון הרכב — שקלול כל דגלי האזהרה לציון 0-100 עם פירוט שקוף
  const scoreResult = computeVehicleScore(vehicle);

  // בדיקת מצב מועדפים (שמירת ההיסטוריה מתבצעת ב-SearchHistoryTracker)
  const user = await getUser();
  let initialIsFavorite = false;
  if (user) {
    initialIsFavorite = await isFavoriteAction(plate);
  }

  // נתוני מבנה (Schema.org) — לתצוגה עשירה ב-Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.manufacturer} ${vehicle.model} ${vehicle.year || ""}`.trim(),
    brand: { "@type": "Brand", name: vehicle.manufacturer },
    model: vehicle.model,
    ...(vehicle.year ? { vehicleModelDate: String(vehicle.year) } : {}),
    ...(vehicle.color ? { color: vehicle.color } : {}),
    ...(vehicle.fuelType ? { fuelType: vehicle.fuelType } : {}),
    ...(vehicle.engineCC ? { vehicleEngine: { "@type": "EngineSpecification", engineDisplacement: { "@type": "QuantitativeValue", value: vehicle.engineCC, unitCode: "CMQ" } } } : {}),
    ...(vehicle.chassis ? { vehicleIdentificationNumber: vehicle.chassis } : {}),
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SearchHistoryTracker
        isLoggedIn={!!user}
        item={{
          plate,
          manufacturer: summary.manufacturer,
          model: summary.model,
          year: summary.year,
          searchedAt: new Date().toISOString(),
        }}
      />
      <div className="mx-auto max-w-[920px] px-4 md:px-6 py-4 md:py-8 space-y-6">
        {/* ===== כותרת להדפסה בלבד ===== */}
        <div className="print-only mb-4 pb-3" style={{ borderBottom: "2px solid #2c3e50" }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: "18px", fontWeight: 900, color: "#2c3e50" }}>
                MyCarPortal · דוח רכב
              </p>
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                {vehicle.manufacturer} {vehicle.model} {vehicle.year} · מספר רישוי{" "}
                {vehicle.plate}
              </p>
            </div>
            <p style={{ fontSize: "11px", color: "#64748b" }}>
              הופק בתאריך {new Date().toLocaleDateString("he-IL")}
            </p>
          </div>
        </div>

        {/* ===== אזהרת סטטוס — רכב לא פעיל / מבוטל ===== */}
        {source === "decommissioned" && (
          <div className="rounded-xl bg-[var(--color-risk-high-bg)] border border-[var(--color-risk-high-border)] p-4 flex items-start gap-3">
            <AlertTriangle size={22} className="text-[var(--color-danger)] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[var(--color-risk-high-text)]">
                ⚠️ רכב זה ירד מהכביש / בוטל סופית
              </p>
              <p className="text-sm text-[var(--color-risk-high-text)] mt-0.5">
                הרכב מופיע במאגר הרכבים שהוצאו משירות (גריטה / ביטול רישום). אם הוצע
                לך למכירה כרכב פעיל — זהו דגל אזהרה חמור. אין לבצע עסקה ללא בדיקה.
              </p>
            </div>
          </div>
        )}
        {source === "inactive" && (
          <div className="rounded-xl bg-[var(--color-risk-warn-bg)] border border-[var(--color-risk-warn-border)] p-4 flex items-start gap-3">
            <AlertTriangle size={22} className="text-[var(--color-warning)] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[var(--color-risk-warn-text)]">
                רכב לא פעיל
              </p>
              <p className="text-sm text-[var(--color-risk-warn-text)] mt-0.5">
                הרכב אינו מופיע כרגע במאגר הרכבים הפעילים (ייתכן רישיון שפג, אי-תשלום
                אגרה או הורדה זמנית מהכביש).
              </p>
            </div>
          </div>
        )}
        {vehicle.isPublicVehicle && (
          <div className="rounded-xl bg-[var(--color-risk-warn-bg)] border border-[var(--color-risk-warn-border)] p-4 flex items-start gap-3">
            <CarTaxiFront size={22} className="text-[var(--color-warning)] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[var(--color-risk-warn-text)]">
                רכב זה רשום במאגר הרכבים הציבוריים
                {vehicle.publicVehicleType ? ` — ${vehicle.publicVehicleType}` : ""}
              </p>
              <p className="text-sm text-[var(--color-risk-warn-text)] mt-0.5">
                רכב ששימש כרכב ציבורי (מונית / הסעות) צובר בדרך כלל קילומטראז׳ ושחיקה
                גבוהים משמעותית מרכב פרטי. אם הרכב מוצע לך למכירה כרכב פרטי — מומלץ
                לבדוק את ההיסטוריה לעומק לפני רכישה.
              </p>
            </div>
          </div>
        )}

        {/* ===== HEADER / HERO ===== */}
        <div className="space-y-4">
          <div className="relative">
            <VehicleImage
              manufacturer={vehicle.manufacturer}
              model={vehicle.model}
              year={vehicle.year}
              color={vehicle.color}
            />
            <div className="absolute bottom-3 start-3">
              <ManufacturerLogo
                slug={vehicle.manufacturerSlug}
                name={vehicle.manufacturer}
                size={48}
                className="shadow-[var(--shadow-md)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)] mb-1">
                {vehicle.manufacturer} {vehicle.model} {vehicle.year}
              </h1>
              <p className="text-sm text-[var(--color-text-subtle)] flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="plate-text font-bold">{vehicle.plate}</span>
                <span>·</span>
                {vehicle.yad > 0 && (
                  <>
                    <span>יד {vehicle.yad}</span>
                    <span>·</span>
                  </>
                )}
                <span>{vehicle.color}</span>
                <span>·</span>
                <span>{vehicle.fuelType}</span>
                {vehicle.trim && (
                  <>
                    <span>·</span>
                    <span>{vehicle.trim}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <SearchActions
            plate={plate}
            initialIsFavorite={initialIsFavorite}
            summary={summary}
            vehicleData={{
              plate: vehicle.plate,
              manufacturer: vehicle.manufacturer,
              model: vehicle.model,
              year: vehicle.year,
              color: vehicle.color,
              fuelType: vehicle.fuelType,
              ownerCount: vehicle.yad,
              lastTestDate: vehicle.testLastDate,
              testExpiryDate: vehicle.testExpiryDate,
              kmAtLastTest: vehicle.kmAtLastTest,
              structuralChange: vehicle.structuralChange,
              colorChanged: vehicle.colorChanged,
              firstRegistrationDate: vehicle.firstRegistrationDate,
              hasOpenRecalls: vehicle.recalls.some((r) => r.open),
            }}
          />
        </div>

        {/* ===== נתוני מפתח במבט אחד ===== */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {vehicle.year > 0 && (
            <StatTile icon={<CalendarDays size={16} />} value={vehicle.year} label="שנת ייצור" />
          )}
          {vehicle.yad > 0 && (
            <StatTile icon={<Users size={16} />} value={`יד ${vehicle.yad}`} label="בעלות" />
          )}
          {vehicle.kmAtLastTest > 0 && (
            <StatTile
              icon={<Gauge size={16} />}
              value={vehicle.kmAtLastTest.toLocaleString()}
              label='ק"מ אחרון'
            />
          )}
          {vehicle.fuelType && (
            <StatTile icon={<Fuel size={16} />} value={vehicle.fuelType} label="דלק" />
          )}
          {vehicle.gearbox && (
            <StatTile icon={<Cog size={16} />} value={vehicle.gearbox} label="תיבת הילוכים" />
          )}
          {vehicle.horsepower > 0 && (
            <StatTile icon={<Zap size={16} />} value={vehicle.horsepower} label="כוח סוס" />
          )}
        </div>

        {/* ===== ניווט מהיר בין סקשנים (נייד בלבד) ===== */}
        <SectionNav hide={hasValueGroup ? [] : ["#value"]} />

        {/* ===== השוואה לרכב אחר ===== */}
        <CompareInput currentPlate={vehicle.plate} />

        {/* ╔══ קבוצה א׳: היסטוריה ובדיקות — הנתונים הקריטיים לקנייה ══╗ */}
        <GroupHeading emoji="🔍" title="היסטוריה ובדיקות" />

        {/* ===== בעלויות ===== */}
        <Section
          id="ownership"
          className="scroll-mt-28 md:scroll-mt-24"
          title="בעלויות"
          icon={<Users size={16} />}
        >
          {vehicle.owners.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-subtle)]">מספר בעלים:</span>
                <span className="text-2xl font-black text-[var(--color-primary-700)]">
                  {vehicle.owners.length}
                </span>
              </div>
              <OwnershipTimeline owners={vehicle.owners} />
              {vehicle.owners[0]?.type === "החכר (ליסינג)" && (
                <p className="mt-4 text-xs text-[var(--color-warning)] flex items-center gap-1">
                  <AlertTriangle size={14} />
                  הרכב התחיל את חייו כליסינג — שווה לבדוק קילומטראז׳
                </p>
              )}
              {shortOwnerships >= 2 && (
                <p className="mt-2 text-xs text-[var(--color-warning)] flex items-center gap-1">
                  <AlertTriangle size={14} />
                  {shortOwnerships} בעלים פרטיים החזיקו ברכב פחות משנה — דפוס שמצדיק
                  בדיקה מעמיקה לפני רכישה
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-subtle)] flex items-start gap-1.5">
              <Info size={15} className="shrink-0 mt-0.5" />
              היסטוריית בעלויות זמינה רק לרכבים מ-2017 ואילך. עבור רכב זה אין נתוני בעלויות במאגר.
            </p>
          )}
        </Section>

        {/* ===== רישוי, טסט וקילומטראז׳ ===== */}
        <Section
          id="test"
          className="scroll-mt-28 md:scroll-mt-24"
          title="רישוי, טסט וקילומטראז׳"
          icon={<ClipboardCheck size={16} />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow
              label="מבחן רישוי אחרון"
              value={
                noPeriodicTestYet ? (
                  <span className="text-[var(--color-text-subtle)]">
                    טרם נדרש (רכב עד גיל 3)
                  </span>
                ) : (
                  vehicle.testLastDate || "—"
                )
              }
            />
            <InfoRow
              label="רישיון בתוקף עד"
              value={
                vehicle.testExpiryDate ? (
                  testExpired ? (
                    <span className="text-[var(--color-danger)] font-bold">
                      {vehicle.testExpiryDate} ✗ (פג)
                    </span>
                  ) : (
                    <span className="text-[var(--color-success)] font-bold">
                      {vehicle.testExpiryDate} ✓
                    </span>
                  )
                ) : (
                  "—"
                )
              }
            />
            {vehicle.kmAtLastTest > 0 && (
              <InfoRow label="ק״מ במבחן אחרון" value={vehicle.kmAtLastTest.toLocaleString()} />
            )}
            {vehicle.kmAtLastTest > 0 && (
              <InfoRow
                label='ממוצע ק"מ לשנה'
                value={Math.round(
                  vehicle.kmAtLastTest / Math.max(1, vehicleAge)
                ).toLocaleString()}
              />
            )}
            <InfoRow
              label="שינוי מבנה"
              value={vehicle.structuralChange ? <Badge variant="danger">כן</Badge> : <Badge variant="success">לא</Badge>}
            />
            <InfoRow
              label="שינוי צבע"
              value={vehicle.colorChanged ? <Badge variant="warning">כן</Badge> : <Badge variant="success">לא</Badge>}
            />
            <InfoRow
              label="וו גרירה"
              value={vehicle.towHook ? <Badge variant="warning">יש</Badge> : <Badge variant="success">אין</Badge>}
            />
            <InfoRow
              label="שינוי צמיגים"
              value={vehicle.tireChanged ? <Badge variant="warning">כן</Badge> : <Badge variant="success">לא</Badge>}
            />
          </div>
          <p className="text-[11px] text-[var(--color-text-subtle)] mt-3 leading-tight">
            ℹ️ התאריך מבוסס על <strong>תוקף רישיון הרכב</strong> ממשרד התחבורה — זהו
            המועד שעד אליו הרכב חוקי לנסיעה (והמועד לחידוש הרישיון + מבחן הרישוי
            הבא). רכב פרטי חדש פטור ממבחן רישוי בשלוש שנותיו הראשונות.
          </p>
        </Section>

        {/* ===== ריקולים ===== */}
        <Section
          id="recalls"
          className="scroll-mt-28 md:scroll-mt-24"
          title="ריקולים"
          icon={<AlertTriangle size={16} />}
        >
          <RecallsList recalls={vehicle.recalls} />
        </Section>

        {/* ╔══ קבוצה ב׳: שווי ועלויות ══╗ */}
        {hasValueGroup && <GroupHeading id="value" emoji="💰" title="שווי ועלויות" />}

        {/* ===== הערכת שווי ===== */}
        {vehicle.originalPrice ? (
          <Section title="הערכת שווי" icon={<Tag size={16} />}>
            <div className="space-y-3">
              {valueEstimate && (
                <div className="rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] p-4">
                  <p className="text-xs text-[var(--color-text-subtle)] mb-0.5">
                    שווי נוכחי משוער (יד שנייה)
                  </p>
                  <p className="text-2xl font-black text-[var(--color-primary-800)]">
                    ₪{valueEstimate.low.toLocaleString()} – ₪
                    {valueEstimate.high.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-subtle)] mt-1 leading-tight">
                    ⚠️ הערכה משוערת בלבד, מחושבת מהמחיר המקורי לפי גיל וקילומטראז׳.
                    אינה מחליפה מחירון מקצועי או הערכת שמאי.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow
                  label={`מחיר מחירון מקורי (חדש, ${vehicle.year})`}
                  value={`₪${vehicle.originalPrice.toLocaleString()}`}
                />
              </div>

              <a
                href="https://levi-itzhak.co.il/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary-600)] hover:underline font-medium"
              >
                <ExternalLink size={15} />
                לבדיקת שווי מדויקת — מחירון לוי יצחק
              </a>
            </div>
          </Section>
        ) : null}

        {/* ===== עלות אחזקה משוערת (TCO) ===== */}
        {costs ? (
          <Section title="עלות אחזקה משוערת" icon={<Wallet size={16} />}>
            <div className="space-y-3">
              {costs.annualTotal !== undefined && (
                <div className="rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] p-4">
                  <p className="text-xs text-[var(--color-text-subtle)] mb-0.5">
                    עלות שנתית משוערת (אגרה + דלק)
                  </p>
                  <p className="text-2xl font-black text-[var(--color-primary-800)]">
                    ₪{costs.annualTotal.toLocaleString()}
                    <span className="text-sm font-medium text-[var(--color-text-subtle)]">
                      {" "}/ שנה
                    </span>
                  </p>
                  {costs.fiveYearTotal !== undefined && (
                    <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
                      ≈ ₪{costs.fiveYearTotal.toLocaleString()} ל-5 שנים
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {costs.licenseFee !== undefined && (
                  <InfoRow
                    label="אגרת רישוי שנתית"
                    value={`₪${costs.licenseFee.toLocaleString()}`}
                  />
                )}
                <InfoRow
                  label='ק"מ שנתי (משוער)'
                  value={costs.annualKm.toLocaleString()}
                />
                {costs.consumptionPer100 !== undefined && (
                  <InfoRow
                    label="צריכת דלק/אנרגיה"
                    value={`${costs.consumptionPer100} ${costs.consumptionUnit}`}
                  />
                )}
                {costs.annualEnergyCost !== undefined && (
                  <InfoRow
                    label="עלות דלק/אנרגיה שנתית"
                    value={`₪${costs.annualEnergyCost.toLocaleString()}`}
                  />
                )}
              </div>

              <p className="text-[11px] text-[var(--color-text-subtle)] leading-tight">
                ⚠️ הערכה גסה. אגרת הרישוי מחושבת לפי קבוצת המחיר (לרכב חדש — יורדת
                עם גיל הרכב). עלות הדלק מחושבת מפליטות ה-CO₂, ק״מ שנתי משוער ומחיר דלק
                עדכני (~מאי 2026). <strong>אינה כוללת ביטוח, טיפולים ובלאי.</strong>
              </p>

              <a
                href="https://govcarins.mof.gov.il/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary-600)] hover:underline font-medium no-print"
              >
                <ExternalLink size={15} />
                להערכת עלות ביטוח — סימולטור משרד האוצר
              </a>
            </div>
          </Section>
        ) : null}

        {/* ===== פופולריות ואמינות הדגם ===== */}
        {(vehicle.modelActiveCount != null || depreciationPct != null) && (
          <Section title="פופולריות ואמינות הדגם" icon={<Users size={16} />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {vehicle.modelActiveCount != null && (
                <div className="rounded-xl border border-[var(--color-border)] p-4 text-center">
                  <p className="text-2xl font-black text-[var(--color-primary-700)]">
                    {vehicle.modelActiveCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                    מהדגם על הכביש בישראל
                  </p>
                  {popularity && (
                    <Badge variant={popularity.variant} className="mt-2">
                      {popularity.label}
                    </Badge>
                  )}
                </div>
              )}

              {survivalPct != null && (
                <div className="rounded-xl border border-[var(--color-border)] p-4 text-center">
                  <p
                    className={`text-2xl font-black ${
                      survivalPct >= 85
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-gray-900)]"
                    }`}
                  >
                    {survivalPct}%
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                    מהדגם עדיין פעילים
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">
                    {vehicle.modelActiveCount!.toLocaleString()} פעילים ·{" "}
                    {vehicle.modelInactiveCount!.toLocaleString()} ירדו מהכביש
                  </p>
                </div>
              )}

              {depreciationPct != null && (
                <div className="rounded-xl border border-[var(--color-border)] p-4 text-center">
                  <p className="text-2xl font-black text-[var(--color-gray-900)]">
                    {depreciationPct > 0 ? `${depreciationPct}%` : "—"}
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                    ירידת ערך מהמחיר המקורי
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">
                    משוער לפי שנה וקילומטראז׳
                  </p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-[var(--color-text-subtle)] mt-3 leading-tight">
              מבוסס על מאגר כמויות הרכבים של משרד התחבורה (כל שנות הייצור של הדגם).
              שיעור הישרדות גבוה = הדגם מאריך-חיים; כמות גבוהה = זמינות חלפים ושירות טובה יותר.
            </p>
          </Section>
        )}

        {/* ╔══ קבוצה ג׳: מפרט ואבזור ══╗ */}
        <GroupHeading id="specs" emoji="🚗" title="מפרט ואבזור" />

        {/* ===== פרטים כלליים ===== */}
        <Section title="פרטים כלליים" icon={<Info size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow label="יצרן" value={`${vehicle.manufacturer} (${vehicle.manufacturerCountry})`} />
            <InfoRow label="שנת ייצור" value={vehicle.year} />
            <InfoRow label="דגם מסחרי" value={vehicle.model} />
            <InfoRow label="צבע" value={vehicle.color} />
            <InfoRow label="סוג דלק" value={vehicle.fuelType} />
            {vehicle.trim && <InfoRow label="רמת גימור" value={vehicle.trim} />}
            <InfoRow label="עלייה לכביש" value={vehicle.firstRegistrationDate} />
            {vehicle.chassis && (
              <InfoRow
                label="מספר שלדה (VIN)"
                value={<span className="plate-text text-xs">{vehicle.chassis}</span>}
              />
            )}
            <InfoRow
              label="יבוא"
              value={
                vehicle.isPersonalImport ? (
                  <Badge variant="warning">{vehicle.importType ?? "יבוא אישי"}</Badge>
                ) : (
                  <Badge variant="default">יבואן רשמי / רגיל</Badge>
                )
              }
            />
            <InfoRow
              label="תג נכה"
              value={
                vehicle.hasDisabilityTag ? (
                  <span className="flex items-center gap-1.5">
                    <Badge variant="warning">רשום</Badge>
                    {vehicle.disabilityTagDate && (
                      <span className="text-xs text-[var(--color-text-subtle)]">
                        הונפק {vehicle.disabilityTagDate}
                      </span>
                    )}
                  </span>
                ) : (
                  <Badge variant="default">לא רשום</Badge>
                )
              }
            />
            <InfoRow
              label="רישום כרכב ציבורי"
              value={
                vehicle.isPublicVehicle ? (
                  <Badge variant="danger">{vehicle.publicVehicleType ?? "רשום"}</Badge>
                ) : (
                  <Badge variant="default">לא</Badge>
                )
              }
            />
          </div>
        </Section>

        {/* ===== מנוע ומפרט טכני — אריחים ויזואליים ===== */}
        <Section title="מנוע ומפרט טכני" icon={<Cog size={16} />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {vehicle.engineCC > 0 && (
              <StatTile
                icon={<Gauge size={16} />}
                value={`${vehicle.engineCC.toLocaleString()} סמ״ק`}
                label="נפח מנוע"
              />
            )}
            {vehicle.horsepower > 0 && (
              <StatTile icon={<Zap size={16} />} value={`${vehicle.horsepower} כ״ס`} label="כוח" />
            )}
            {vehicle.propulsion && (
              <StatTile icon={<Fuel size={16} />} value={vehicle.propulsion} label="טכנולוגיית הנעה" />
            )}
            {vehicle.gearbox && (
              <StatTile icon={<Cog size={16} />} value={vehicle.gearbox} label="תיבת הילוכים" />
            )}
            {vehicle.bodyType && (
              <StatTile icon={<CarFront size={16} />} value={vehicle.bodyType} label="סוג מרכב" />
            )}
            {vehicle.doors > 0 && (
              <StatTile icon={<DoorOpen size={16} />} value={vehicle.doors} label="דלתות" />
            )}
            {vehicle.seats > 0 && (
              <StatTile icon={<Armchair size={16} />} value={vehicle.seats} label="מושבים" />
            )}
            {vehicle.weightKg > 0 && (
              <StatTile
                icon={<Weight size={16} />}
                value={`${vehicle.weightKg.toLocaleString()} ק״ג`}
                label="משקל כולל"
              />
            )}
            {vehicle.towingKg > 0 && (
              <StatTile
                icon={<Caravan size={16} />}
                value={`${vehicle.towingKg.toLocaleString()} ק״ג`}
                label="גרירה (עם בלמים)"
              />
            )}
            {vehicle.towingNoBrakes ? (
              <StatTile
                icon={<Caravan size={16} />}
                value={`${vehicle.towingNoBrakes.toLocaleString()} ק״ג`}
                label="גרירה (ללא בלמים)"
              />
            ) : null}
          </div>
        </Section>

        {/* ===== אבזור ונוחות ===== */}
        {(vehicle.hasAC !== undefined ||
          vehicle.powerSteering !== undefined ||
          (vehicle.electricWindows ?? 0) > 0) && (
          <Section title="אבזור ונוחות" icon={<AirVent size={16} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {vehicle.hasAC !== undefined && (
                <InfoRow
                  label="מזגן"
                  value={vehicle.hasAC ? <Badge variant="success">יש</Badge> : <Badge variant="default">אין</Badge>}
                />
              )}
              {vehicle.powerSteering !== undefined && (
                <InfoRow
                  label="הגה כוח"
                  value={vehicle.powerSteering ? <Badge variant="success">יש</Badge> : <Badge variant="default">אין</Badge>}
                />
              )}
              {(vehicle.electricWindows ?? 0) > 0 && (
                <InfoRow label="חלונות חשמל" value={vehicle.electricWindows} />
              )}
            </div>
          </Section>
        )}

        {/* ===== בטיחות ===== */}
        <Section
          id="safety"
          className="scroll-mt-28 md:scroll-mt-24"
          title="בטיחות ומערכות סיוע"
          icon={<ShieldCheck size={16} />}
        >
          <SafetyGrid safety={vehicle.safety} />
        </Section>

        {/* ===== סביבה ופליטות ===== */}
        <Section title="סביבה ופליטות" icon={<Leaf size={16} />}>
          {(vehicle.greenScore > 0 || vehicle.pollutionGroup > 0) && (
            <div className="space-y-4 mb-4 pb-4 border-b border-[var(--color-border)]">
              {vehicle.pollutionGroup > 0 && (
                <ScaleBar
                  label="קבוצת זיהום"
                  value={vehicle.pollutionGroup}
                  max={15}
                  lowIsGood
                  hint="1 = הכי נקי · 15 = הכי מזהם. משפיע על אגרת הרישוי."
                />
              )}
              {vehicle.greenScore > 0 && (
                <ScaleBar
                  label="מדד ירוק"
                  value={vehicle.greenScore}
                  max={15}
                  lowIsGood
                  hint="ציון סביבתי לפי פליטות — נמוך = ירוק יותר."
                />
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {vehicle.emissionStandard && (
              <InfoRow label="תקן זיהום" value={vehicle.emissionStandard} />
            )}
            {vehicle.converterType && (
              <InfoRow label="סוג ממיר" value={vehicle.converterType} />
            )}
            {vehicle.co2 > 0 && (
              <InfoRow label="פליטת CO₂ (WLTP)" value={`${vehicle.co2} g/km`} />
            )}
            {vehicle.nox > 0 && (
              <InfoRow label="פליטת NOx (WLTP)" value={`${vehicle.nox} g/km`} />
            )}
            {vehicle.pmWltp ? (
              <InfoRow label="חלקיקים PM (WLTP)" value={`${vehicle.pmWltp} mg/km`} />
            ) : null}
            {vehicle.hcWltp ? (
              <InfoRow label="פליטת HC (WLTP)" value={`${vehicle.hcWltp} mg/km`} />
            ) : null}
            {vehicle.coWltp ? (
              <InfoRow label="פליטת CO (WLTP)" value={`${vehicle.coWltp} mg/km`} />
            ) : null}
          </div>
        </Section>

        {/* ===== צמיגים — כרטיס לכל סרן ===== */}
        <Section title="צמיגים" icon={<Disc3 size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "סרן קדמי", size: vehicle.tireFront, load: vehicle.loadFront, speed: vehicle.speedRating },
              { title: "סרן אחורי", size: vehicle.tireRear, load: vehicle.loadRear, speed: vehicle.speedRatingRear },
            ].map((axle) => (
              <div
                key={axle.title}
                className="rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-3"
              >
                <span className="w-10 h-10 shrink-0 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-600)] grid place-items-center">
                  <Disc3 size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-[var(--color-text-subtle)]">{axle.title}</p>
                  <p className="plate-text font-black text-[var(--color-gray-900)]" dir="ltr">
                    {axle.size || "—"}
                  </p>
                  {(axle.load > 0 || axle.speed) && (
                    <p className="text-[11px] text-[var(--color-text-subtle)] mt-0.5">
                      {axle.load > 0 && <>קוד עומס {axle.load}</>}
                      {axle.load > 0 && axle.speed && " · "}
                      {axle.speed && <>מהירות {axle.speed}</>}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== ציון הרכב — סיכום כל הבדיקות, בתחתית אחרי שראו את הנתונים ===== */}
        <Section
          id="score"
          className="scroll-mt-28 md:scroll-mt-24"
          title="ציון הרכב"
          icon={<Gauge size={16} />}
        >
          <VehicleScoreCard result={scoreResult} />
        </Section>

        {/* ===== קישורים שימושיים ===== */}
        <Section title="קישורים שימושיים" icon={<ExternalLink size={16} />}>
          <ul className="space-y-2">
            {[
              {
                icon: "🚓",
                title: "בדיקת רכב גנוב",
                sub: "זיהוי לפי מספר רישוי · משטרת ישראל",
                href: "https://www.gov.il/he/service/licence_plate_stolen_vehicle_identification",
              },
              {
                icon: "💰",
                title: "מחירון לוי יצחק",
                sub: "בדיקת שווי שוק מדויקת",
                href: "https://levi-itzhak.co.il/",
              },
              {
                icon: "📋",
                title: "דוח בעלות על רכב",
                sub: "שירות רשמי · משרד התחבורה",
                href: "https://www.gov.il/he/service/vehicle-ownership-report",
              },
              {
                icon: "🛡️",
                title: "סימולטור ביטוח רכב",
                sub: "השוואת מחירי ביטוח · משרד האוצר",
                href: "https://govcarins.mof.gov.il/",
              },
              {
                icon: "📖",
                title: "היסטוריית רכב מפורטת",
                sub: "מאגר רשמי · משרד התחבורה",
                href: "https://www.gov.il/he/Departments/DynamicCollectors/private_vehicle_history_1",
              },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{link.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{link.title}</p>
                      <p className="text-xs text-[var(--color-text-subtle)]">
                        {link.sub}
                      </p>
                    </div>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-[var(--color-text-subtle)] shrink-0"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Section>

        {/* ===== Disclaimer ===== */}
        <div className="rounded-xl bg-[var(--color-risk-warn-bg)] border border-[var(--color-risk-warn-border)] p-4 text-sm text-[var(--color-risk-warn-text)] leading-relaxed">
          <div className="flex gap-2">
            <AlertTriangle size={20} className="shrink-0" />
            <div>
              <p className="font-bold mb-1">מידע שלא זמין במאגרים הציבוריים</p>
              <p className="text-xs">
                היסטוריית תאונות, פירוט מבחני טסט קודמים, פרטי בעלים. המידע מבוסס על נתונים ציבוריים בלבד —
                <strong> לפני רכישה, מומלץ בחום לבצע בדיקה פיזית במכון מורשה.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* כותרת תחתונה להדפסה בלבד */}
        <div
          className="print-only pt-3 mt-2"
          style={{ borderTop: "1px solid #cbd5e1" }}
        >
          <p style={{ fontSize: "10px", color: "#64748b", lineHeight: 1.5 }}>
            הדוח הופק על ידי MyCarPortal ({new Date().toLocaleDateString("he-IL")})
            על בסיס נתונים ציבוריים מ-data.gov.il (משרד התחבורה). המידע אינפורמטיבי
            בלבד ואינו מחליף בדיקה פיזית במכון מורשה. הערכת השווי משוערת ואינה מחייבת.
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center pt-4 no-print">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--color-primary-600)] hover:underline"
          >
            ← חיפוש רכב נוסף
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}

// כותרת קבוצה — מפרידה ויזואלית בין שלוש קבוצות התוכן של הדוח
function GroupHeading({ id, emoji, title }: { id?: string; emoji: string; title: string }) {
  return (
    <div id={id} className="flex items-center gap-3 pt-3 scroll-mt-28 md:scroll-mt-24">
      <h2 className="text-lg font-black text-[var(--color-gray-900)] shrink-0">
        <span aria-hidden="true" className="me-1.5">
          {emoji}
        </span>
        {title}
      </h2>
      <div className="h-px flex-1 bg-[var(--color-border)]" aria-hidden="true" />
    </div>
  );
}
