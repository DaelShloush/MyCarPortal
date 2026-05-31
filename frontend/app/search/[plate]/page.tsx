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
  BarChart3,
  ExternalLink,
  Tag,
  Wallet,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Section, InfoRow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/domain/risk-badge";
import { VehicleImage } from "@/components/domain/vehicle-image";
import { ManufacturerLogo } from "@/components/domain/manufacturer-logo";
import { OwnershipTimeline } from "@/components/domain/ownership-timeline";
import { RecallsList } from "@/components/domain/recalls-list";
import { SafetyGrid } from "@/components/domain/safety-grid";
import { RiskBreakdown } from "@/components/domain/risk-breakdown";
import { SearchActions } from "@/components/domain/search-actions";
import { SearchHistoryTracker } from "@/components/domain/search-history-tracker";
import { CompareInput } from "@/components/domain/compare-input";
import { fetchVehicleByPlate } from "@/lib/api/vehicle-aggregator";
import { createClient } from "@/lib/supabase/server";
import { isFavoriteAction } from "@/app/actions/favorites";
import { estimateCurrentValue } from "@/lib/value-estimator";
import { estimateCosts } from "@/lib/cost-estimator";

interface SearchPageProps {
  params: Promise<{ plate: string }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { plate } = await params;

  if (!plate || !/^\d{5,8}$/.test(plate)) notFound();

  let result: Awaited<ReturnType<typeof fetchVehicleByPlate>> = null;
  let apiError = false;

  try {
    result = await fetchVehicleByPlate(plate);
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
    riskScore: vehicle.riskScore,
    riskTone: vehicle.riskTone,
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
  // testExpiryDate בפורמט DD/MM/YYYY — בדיקה אם פג
  const testExpired = (() => {
    const m = vehicle.testExpiryDate?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return false;
    const expiry = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    return expiry.getTime() < Date.now();
  })();

  // בדיקת מצב מועדפים (שמירת ההיסטוריה מתבצעת ב-SearchHistoryTracker)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let initialIsFavorite = false;
  if (user) {
    initialIsFavorite = await isFavoriteAction(plate);
  }

  return (
    <SiteShell>
      <SearchHistoryTracker
        isLoggedIn={!!user}
        item={{
          plate,
          manufacturer: summary.manufacturer,
          model: summary.model,
          year: summary.year,
          riskScore: summary.riskScore,
          riskTone: summary.riskTone,
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
                <span>יד {vehicle.yad}</span>
                <span>·</span>
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
            <RiskBadge
              score={vehicle.riskScore}
              tone={vehicle.riskTone}
              showMessage
            />
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

        {/* ===== השוואה לרכב אחר ===== */}
        <CompareInput currentPlate={vehicle.plate} />

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

        {/* ===== 1. פרטים כלליים ===== */}
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
                  <Badge variant="warning">רשום</Badge>
                ) : (
                  <Badge variant="default">לא רשום</Badge>
                )
              }
            />
          </div>
        </Section>

        {/* ===== 2. מנוע ומפרט טכני ===== */}
        <Section title="מנוע ומפרט טכני" icon={<Cog size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {vehicle.engineCC > 0 && (
              <InfoRow label="נפח מנוע" value={`${vehicle.engineCC.toLocaleString()} סמ״ק`} />
            )}
            {vehicle.horsepower > 0 && (
              <InfoRow label="כוח" value={`${vehicle.horsepower} כ״ס`} />
            )}
            {vehicle.propulsion && (
              <InfoRow label="טכנולוגיית הנעה" value={vehicle.propulsion} />
            )}
            {vehicle.gearbox && (
              <InfoRow label="תיבת הילוכים" value={vehicle.gearbox} />
            )}
            {vehicle.bodyType && (
              <InfoRow label="סוג מרכב" value={vehicle.bodyType} />
            )}
            {vehicle.doors > 0 && <InfoRow label="דלתות" value={vehicle.doors} />}
            {vehicle.seats > 0 && <InfoRow label="מושבים" value={vehicle.seats} />}
            {vehicle.weightKg > 0 && (
              <InfoRow label="משקל כולל" value={`${vehicle.weightKg.toLocaleString()} ק״ג`} />
            )}
            {vehicle.towingKg > 0 && (
              <InfoRow label="כושר גרירה (עם בלמים)" value={`${vehicle.towingKg.toLocaleString()} ק״ג`} />
            )}
            {vehicle.towingNoBrakes ? (
              <InfoRow label="כושר גרירה (ללא בלמים)" value={`${vehicle.towingNoBrakes.toLocaleString()} ק״ג`} />
            ) : null}
          </div>
        </Section>

        {/* ===== 3. בעלויות ===== */}
        <Section title="בעלויות" icon={<Users size={16} />}>
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
        </Section>

        {/* ===== 4. טסט וקילומטראז׳ ===== */}
        <Section title="רישוי, טסט וקילומטראז׳" icon={<ClipboardCheck size={16} />}>
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

        {/* ===== 5. ריקולים ===== */}
        <Section title="ריקולים" icon={<AlertTriangle size={16} />}>
          <RecallsList recalls={vehicle.recalls} />
        </Section>

        {/* ===== 6. בטיחות ===== */}
        <Section title="בטיחות ומערכות סיוע" icon={<ShieldCheck size={16} />}>
          <SafetyGrid safety={vehicle.safety} />
        </Section>

        {/* ===== 7. סביבה ופליטות ===== */}
        <Section title="סביבה ופליטות" icon={<Leaf size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {vehicle.greenScore > 0 && (
              <InfoRow label="מדד ירוק" value={`${vehicle.greenScore} / 15`} />
            )}
            {vehicle.pollutionGroup > 0 && (
              <InfoRow label="קבוצת זיהום" value={`${vehicle.pollutionGroup} / 15`} />
            )}
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

        {/* ===== 8. צמיגים ===== */}
        <Section title="צמיגים" icon={<Disc3 size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow label="צמיג קדמי" value={vehicle.tireFront} />
            <InfoRow label="צמיג אחורי" value={vehicle.tireRear} />
            <InfoRow label="עומס קדמי" value={vehicle.loadFront} />
            <InfoRow label="דירוג מהירות" value={vehicle.speedRating} />
          </div>
        </Section>

        {/* ===== 9. דירוג סיכון — פירוט ===== */}
        <Section title="דירוג סיכון — פירוט" icon={<BarChart3 size={16} />}>
          <RiskBreakdown
            breakdown={vehicle.riskBreakdown}
            total={vehicle.riskScore}
            tone={vehicle.riskTone}
          />
        </Section>

        {/* ===== 10. קישורים שימושיים ===== */}
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
                היסטוריית תאונות, פירוט מבחני טסט קודמים, פרטי בעלים. הציון מבוסס על נתונים ציבוריים בלבד —
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
