import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * המשתמש המאומת — קריאה אחת לכל request (React cache).
 * בלי זה כל רכיב שצריך את המשתמש (עמוד, SiteShell, actions שרצים בזמן render)
 * יורה קריאת רשת נפרדת ל-Supabase Auth (~60-300ms כל אחת) — הגורם המרכזי
 * לאיטיות מעבר בין דפים אצל משתמשים מחוברים.
 * לאורחים אין session — הקריאה חוזרת מיד ללא רשת.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — cookies set in middleware
          }
        },
      },
    }
  );
}
