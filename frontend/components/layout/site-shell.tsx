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
 * שולף את המשתמש ב-SSR ומעביר ל-Navbar כדי למנוע הבהוב של כפתורי auth.
 */
export async function SiteShell({ children }: SiteShellProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
