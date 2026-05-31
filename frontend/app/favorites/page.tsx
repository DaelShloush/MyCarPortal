import Link from "next/link";
import { AuthRequired } from "@/components/domain/auth-required";
import { Star } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { FavoritesGrid } from "@/components/domain/favorites-grid";
import { createClient } from "@/lib/supabase/server";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <AuthRequired feature="המועדפים שלך" />;

  const [favRes, profileRes] = await Promise.all([
    supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false }),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  const favorites = favRes.data ?? [];
  const isPremium = profileRes.data?.plan === "premium";
  const maxCompare = isPremium ? 4 : 2;

  // נרמול ל-shape שטוח עבור הרכיב
  const items = favorites.map((fav) => {
    const summary = (fav.cached_data ?? {}) as Record<string, unknown>;
    return {
      id: fav.id as string,
      license_plate: fav.license_plate as string,
      notes: (fav.notes as string | null) ?? null,
      added_at: fav.added_at as string,
      manufacturer: String(summary.manufacturer ?? ""),
      model: String(summary.model ?? ""),
      year: summary.year ? Number(summary.year) : null,
      riskScore: Number(summary.riskScore ?? 0),
    };
  });

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--color-gray-900)]">
              מועדפים
            </h1>
            <p className="text-sm text-[var(--color-text-subtle)] mt-1">
              {items.length} רכבים שמורים
              {items.length >= 2 && (
                <span> · בחר רכבים להשוואה (עד {maxCompare})</span>
              )}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-subtle)]">
            <Star size={40} className="mx-auto mb-4 opacity-30" />
            <p className="mb-4">עוד לא שמרת רכבים למועדפים</p>
            <Link href="/">
              <Button variant="primary">חפש רכב</Button>
            </Link>
          </div>
        ) : (
          <FavoritesGrid items={items} maxCompare={maxCompare} />
        )}
      </div>
    </SiteShell>
  );
}
