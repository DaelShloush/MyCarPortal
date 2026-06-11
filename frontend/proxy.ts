import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// cookie ה-session של Supabase: sb-<ref>-auth-token, לעיתים מפוצל ל-.0/.1
// (לא לתפוס את sb-...-auth-token-code-verifier של OAuth)
const AUTH_COOKIE_RE = /-auth-token(\.\d+)?$/;

// מרעננים רק כשנשארו פחות מ-5 דקות לתוקף ה-access token
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

/**
 * קורא את מועד פקיעת ה-access token מתוך ה-cookie, בלי קריאת רשת.
 * אם הפורמט לא מוכר — מחזיר null וניפול לרענון מלא (בטוח).
 */
function readSessionExpiry(request: NextRequest): number | null {
  try {
    const raw = request.cookies
      .getAll()
      .filter((c) => AUTH_COOKIE_RE.test(c.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => c.value)
      .join("");
    if (!raw) return null;

    const json = raw.startsWith("base64-")
      ? atob(raw.slice(7).replace(/-/g, "+").replace(/_/g, "/"))
      : decodeURIComponent(raw);
    const session = JSON.parse(json) as { expires_at?: number };
    return typeof session.expires_at === "number" ? session.expires_at * 1000 : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  // אורח — אין session לרענן, אין מה לעשות (0ms במקום קריאת רשת)
  const hasSession = request.cookies.getAll().some((c) => AUTH_COOKIE_RE.test(c.name));
  if (!hasSession) return NextResponse.next({ request });

  // token בתוקף לעוד הרבה זמן — אין צורך לרענן. העמודים המוגנים עדיין
  // מאמתים עם getUser() משלהם, כך שביטול session נתפס שם.
  const expiresAt = readSessionExpiry(request);
  if (expiresAt && expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // חשוב: getUser() מרענן את ה-session ומסנכרן את ה-cookies.
  // אין כאן redirect — הגנת העמודים נעשית ברמת העמוד (רכיב AuthRequired),
  // כדי לא לתקוע את האורח במלכודת כפתור Back.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    // מדלגים על נכסים סטטיים, PWA ו-API (לעמודי API אין session לרענן)
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|offline.html|robots.txt|sitemap.xml|icons/|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
