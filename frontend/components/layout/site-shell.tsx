import { Navbar, type NavUser } from "./navbar";
import { Footer } from "./footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { createClient } from "@/lib/supabase/server";

interface SiteShellProps {
  children: React.ReactNode;
}

/**
 * SiteShell — Layout wrapper משותף לכל עמוד.
 * Navbar למעלה, Footer למטה (דסקטופ), Bottom Nav במובייל.
 *
 * מצב המשתמש ל-Navbar נקרא מה-session המקומי (cookie) ולא דרך getUser() —
 * getUser() יוצא לרשת ל-Supabase Auth בכל עמוד (~60-300ms) והאט כל ניווט.
 * זה בטוח כאן: ה-Navbar רק *מציג* שם משתמש; כל גישה לנתונים מוגנת ב-RLS,
 * ועמודים מוגנים עושים getUser() אמיתי בעצמם. בנוסף ה-Navbar מתעדכן
 * client-side דרך onAuthStateChange.
 */
export async function SiteShell({ children }: SiteShellProps) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  const initialUser: NavUser | null = user
    ? {
        name:
          (user.user_metadata?.name as string | undefined) ??
          user.email ??
          "משתמש",
        email: user.email ?? "",
      }
    : null;

  return (
    <>
      <Navbar initialUser={initialUser} />
      <main id="main" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
