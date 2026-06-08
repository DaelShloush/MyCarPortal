import { Crown, Bell, Mail, Lock, LogOut, CreditCard, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import { AuthRequired } from "@/components/domain/auth-required";
import { SiteShell } from "@/components/layout/site-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { updateProfileAction } from "@/app/actions/profile";
import { logoutAction } from "@/app/(auth)/actions";

interface SettingsPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <AuthRequired feature="ההגדרות" />;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, plan, push_enabled")
    .eq("id", user.id)
    .single();

  const sp = await searchParams;
  const success = sp?.success === "1";
  const errorMsg = sp?.error ?? null;

  const userName = profile?.name ?? user.user_metadata?.name ?? "";
  const userEmail = user.email ?? "";
  const isPremium = profile?.plan === "premium";

  return (
    <SiteShell>
      <div className="mx-auto max-w-[760px] px-4 md:px-6 py-6 md:py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)]">
          הגדרות
        </h1>

        {/* Success / Error banners */}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
            <CheckCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">הפרטים עודכנו בהצלחה!</p>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{decodeURIComponent(errorMsg)}</p>
          </div>
        )}

        {/* Profile */}
        <Card>
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-bold mb-1">פרופיל</h2>
            <p className="text-xs text-[var(--color-text-subtle)]">
              פרטים אישיים שמופיעים באפליקציה
            </p>
          </div>
          <form action={updateProfileAction} className="p-5 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">שם מלא</label>
              <Input
                name="name"
                defaultValue={userName}
                placeholder="הזן את שמך"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">אימייל</label>
              <Input
                type="email"
                value={userEmail}
                disabled
                className="opacity-60 cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                לשינוי אימייל יש לפנות לתמיכה
              </p>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              שמור שינויים
            </Button>
          </form>
        </Card>

        {/* Subscription */}
        <Card>
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-bold mb-1">מנוי</h2>
            <p className="text-xs text-[var(--color-text-subtle)]">
              ניהול תוכנית והעדפות חיוב
            </p>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl grid place-items-center ${isPremium ? "bg-amber-100" : "bg-[var(--color-gray-200)]"}`}>
                  <Crown size={20} className={isPremium ? "text-amber-600" : "text-[var(--color-gray-500)]"} />
                </div>
                <div>
                  <p className="font-bold flex items-center gap-2">
                    {isPremium ? "Premium" : "תוכנית חינם"}
                    <Badge variant={isPremium ? "premium" : "default"}>פעיל</Badge>
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)]">
                    {isPremium
                      ? "עד 3 רכבים · מסמכים ללא הגבלה · אימייל + Push"
                      : "1 רכב · 5 מסמכים · אימייל בלבד"}
                  </p>
                </div>
              </div>
              {!isPremium && (
                <Button variant="primary" className="bg-amber-600 hover:bg-amber-700">
                  <Crown size={16} />
                  שדרג
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-bold mb-1">התראות</h2>
            <p className="text-xs text-[var(--color-text-subtle)]">
              איך נדע אותך לפני שטסט או ביטוח פגים
            </p>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {[
              {
                icon: Mail,
                title: "התראות אימייל",
                body: "תזכורות לטסט וביטוח",
                on: true,
                premium: false,
              },
              {
                icon: Bell,
                title: "התראות Push",
                body: "דורש Premium ו-Add to Home Screen",
                on: profile?.push_enabled ?? false,
                premium: true,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const active = item.on && (!item.premium || isPremium);
              return (
                <li key={i} className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] grid place-items-center text-[var(--color-primary-700)]">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold flex items-center gap-2">
                      {item.title}
                      {item.premium && <Badge variant="premium">Premium</Badge>}
                    </p>
                    <p className="text-xs text-[var(--color-text-subtle)]">
                      {item.body}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      active
                        ? "bg-[var(--color-primary-500)]"
                        : "bg-[var(--color-gray-300)]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        active ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Account */}
        <Card>
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-bold mb-1">חשבון</h2>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            <li className="p-5 flex items-center gap-3 hover:bg-[var(--color-bg-subtle)] cursor-pointer">
              <Lock size={20} className="opacity-70" />
              <div className="flex-1 min-w-0">
                <p className="font-bold">שינוי סיסמה</p>
                <p className="text-xs text-[var(--color-text-subtle)]">
                  נשלח קישור לאיפוס לאימייל שלך
                </p>
              </div>
              <ChevronLeft size={18} className="opacity-50" />
            </li>
            <li className="p-5 flex items-center gap-3 hover:bg-[var(--color-bg-subtle)] cursor-pointer">
              <CreditCard size={20} className="opacity-70" />
              <div className="flex-1 min-w-0">
                <p className="font-bold">אמצעי תשלום</p>
                <p className="text-xs text-[var(--color-text-subtle)]">
                  אין אמצעי תשלום שמור
                </p>
              </div>
              <ChevronLeft size={18} className="opacity-50" />
            </li>
            <li>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full p-5 flex items-center gap-3 hover:bg-red-50 text-[var(--color-danger)] transition-colors"
                >
                  <LogOut size={20} className="opacity-70" />
                  <div className="flex-1 min-w-0 text-start">
                    <p className="font-bold">התנתק</p>
                    <p className="text-xs text-[var(--color-text-subtle)]">
                      סיים את הסשן הנוכחי
                    </p>
                  </div>
                  <ChevronLeft size={18} className="opacity-50" />
                </button>
              </form>
            </li>
          </ul>
        </Card>

        <p className="text-xs text-center text-[var(--color-text-subtle)]">
          MyCarPortal v0.1.0 · נבנה עם ❤️ בישראל
        </p>
      </div>
    </SiteShell>
  );
}
