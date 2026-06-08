import Link from "next/link";
import { Clock, Car } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Card } from "@/components/ui/card";
import { GuestHistoryList } from "@/components/domain/guest-history-list";
import { createClient } from "@/lib/supabase/server";

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "היום";
  if (days === 1) return "אתמול";
  if (days < 7) return `לפני ${days} ימים`;
  if (days < 30) return `לפני ${Math.floor(days / 7)} שבועות`;
  return d.toLocaleDateString("he-IL");
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // אורח — מציג היסטוריה מ-localStorage
  if (!user) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 md:py-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)]">
              היסטוריית חיפושים
            </h1>
            <p className="text-sm text-[var(--color-text-subtle)] mt-1">
              החיפושים האחרונים שלך
            </p>
          </div>
          <GuestHistoryList />
        </div>
      </SiteShell>
    );
  }

  // פרמיום — היסטוריה ללא הגבלה; חינם — 20 אחרונים
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const isPremium = profile?.plan === "premium";

  const historyQuery = supabase
    .from("search_history")
    .select("*")
    .eq("user_id", user.id)
    .order("searched_at", { ascending: false });
  if (!isPremium) historyQuery.limit(20);

  const { data: history } = await historyQuery;
  const items = history ?? [];

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)]">
            היסטוריית חיפושים
          </h1>
          <p className="text-sm text-[var(--color-text-subtle)] mt-1">
            {isPremium ? "כל החיפושים שלך" : "20 חיפושים אחרונים"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-subtle)]">
            <Clock size={40} className="mx-auto mb-4 opacity-30" />
            <p className="mb-4">עוד לא חיפשת רכבים</p>
            <Link href="/" className="text-[var(--color-primary-600)] hover:underline font-medium">
              חיפוש ראשון →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const summary = item.result_summary as Record<string, unknown> | null;
              return (
                <Link key={item.id} href={`/search/${item.license_plate}`}>
                  <Card className="p-4 flex items-center gap-4 hover:shadow-[var(--shadow-sm)] transition-shadow cursor-pointer">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-[var(--color-gray-100)] grid place-items-center text-[var(--color-gray-400)]">
                      <Car size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--color-gray-900)] truncate">
                        {String(summary?.manufacturer ?? "")} {String(summary?.model ?? "")}
                        {summary?.year ? ` ${summary.year}` : ""}
                      </p>
                      <p className="text-xs text-[var(--color-text-subtle)] plate-text">
                        {item.license_plate}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--color-text-subtle)] shrink-0">
                      {formatRelative(item.searched_at)}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
