import Link from "next/link";
import {
  Wallet,
  Search as SearchIcon,
  Bell,
  FileText,
  Star,
  Smartphone,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { SearchInput } from "@/components/domain/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Wallet,
    title: "הערכת שווי ועלויות",
    body: "שווי מוערך לפי שנה וקילומטראז׳, ועלות אחזקה שנתית — אגרת רישוי ודלק.",
  },
  {
    icon: SearchIcon,
    title: "מידע רשמי בלבד",
    body: "כל הנתונים נשלפים ישירות ממאגרי משרד התחבורה (data.gov.il).",
  },
  {
    icon: Bell,
    title: "תזכורות חכמות",
    body: "טסט וביטוח מתקרבים? תקבל התראת אימייל לפני שתהיה במינוס.",
  },
  {
    icon: FileText,
    title: "ניהול מסמכים",
    body: "רישיון, ביטוח, קבלות טיפול — הכל מסודר במקום אחד, נגיש מהמובייל.",
  },
  {
    icon: Star,
    title: "מועדפים והשוואה",
    body: "שמור רכבים שאתה שוקל, השווה ביניהם והחלט בלי להתבלבל.",
  },
  {
    icon: Smartphone,
    title: "PWA — מותקן בטלפון",
    body: "הוסף למסך הבית של iPhone או Android ותקבל חוויה כמו אפליקציה.",
  },
];

const STEPS = [
  { num: "01", title: "הזן מספר רישוי", body: "5–8 ספרות — בלי הרשמה ובלי תשלום." },
  { num: "02", title: "אנחנו שולפים את הנתונים", body: "מספר קריאות מקבילות למאגרי data.gov.il — תוך שניות." },
  { num: "03", title: "מקבל את כל המידע", body: "הכל על עמוד אחד — בעלויות, טסט, ריקולים, בטיחות ושווי." },
];

const PREVIEW_POINTS = [
  { icon: FileText, label: "היסטוריית בעלויות, טסט וריקולים" },
  { icon: Wallet, label: "הערכת שווי ועלות אחזקה" },
  { icon: Star, label: "פופולריות ואמינות הדגם" },
];

export default function LandingPage() {
  return (
    <SiteShell>
      {/* ===== HERO ===== */}
      <section className="relative bg-[var(--color-primary-700)] text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 80% 80%, #2563eb 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-5">
              <Sparkles size={14} />
              חינם · ללא הרשמה · נתוני 4.1M רכבים
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              בדוק כל רכב בישראל
              <br />
              <span className="text-[var(--color-primary-300)]">תוך שניות</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              היסטוריית בעלויות, טסט, ריקולים, בטיחות והערכת שווי — מאוחדים מכל המקורות הרשמיים, מוצגים בפשטות.
            </p>

            <SearchInput className="bg-white" />

            <p className="text-xs text-white/60 mt-3 ms-1">
              הזינו מספר רישוי בן 5–8 ספרות (ללא מקפים)
            </p>
          </div>

          {/* כרטיס תצוגה ניטרלי — מה מקבלים (ללא נתוני דמו) */}
          <div className="hidden lg:block absolute end-6 top-1/2 -translate-y-1/2 max-w-xs w-72">
            <Card className="bg-white/95 backdrop-blur p-5 shadow-[var(--shadow-lg)]">
              <div className="flex items-center gap-2 mb-3 text-[var(--color-primary-700)]">
                <SearchIcon size={18} />
                <span className="font-bold text-[var(--color-text)]">מה מקבלים בחיפוש</span>
              </div>
              <ul className="space-y-3">
                {PREVIEW_POINTS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.label} className="flex items-center gap-3 text-sm text-[var(--color-text)]">
                      <span className="w-8 h-8 shrink-0 rounded-lg bg-[var(--color-primary-50)] grid place-items-center text-[var(--color-primary-600)]">
                        <Icon size={16} />
                      </span>
                      {p.label}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
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

      {/* ===== FEATURES ===== */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)] mb-3">
            כל מה שצריך לדעת על רכב — במקום אחד
          </h2>
          <p className="text-[var(--color-text-subtle)]">
            לפני שאתה רוכש רכב יד שנייה, ובמהלך החיים עם הרכב שלך — אנחנו מסדרים את הכל בשבילך.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-5 hover:shadow-[var(--shadow-md)] transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-50)] grid place-items-center text-[var(--color-primary-700)] mb-4">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-bold text-[var(--color-gray-900)] mb-1">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {f.body}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-[var(--color-bg-subtle)]">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-black text-center text-[var(--color-gray-900)] mb-10">
            איך זה עובד?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-5xl font-black text-[var(--color-primary-100)] mb-2 leading-none">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 py-12 md:py-16">
        <Card className="bg-gradient-to-br from-[var(--color-primary-700)] to-[var(--color-primary-500)] text-white p-8 md:p-12 text-center border-0">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            יש לך רכב? נהל אותו אצלנו.
          </h2>
          <p className="text-white/85 mb-6 max-w-lg mx-auto">
            תזכורות לטסט וביטוח, היסטוריית טיפולים, ומסמכים דיגיטליים — הכל חינם.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-[var(--color-primary-700)] hover:bg-white/90">
              הרשמה חינם
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <p className="text-xs text-white/70 mt-4">
            ללא כרטיס אשראי · גרסת חינם תמיד תישאר חינמית
          </p>
        </Card>
      </section>

      {/* ===== DISCLAIMER ===== */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 pb-12">
        <p className="text-xs text-center text-[var(--color-text-subtle)] leading-relaxed">
          ⚠️ המידע מבוסס על נתונים ציבוריים בלבד ואינו מחליף בדיקה פיזית במכון מורשה.
          אין לנו גישה להיסטוריית תאונות, ולא לפרטי בעלים (חוק פרטיות).
        </p>
      </section>
    </SiteShell>
  );
}
