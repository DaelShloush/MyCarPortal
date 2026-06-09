import { NextRequest, NextResponse } from "next/server";
import { fetchVehicleByPlate } from "@/lib/api/vehicle-aggregator";

// Rate limiting — in-memory token bucket לפי IP.
// ⚠️ best-effort בלבד: ב-Vercel (serverless) המצב מתאפס בין instances/קולד-סטארט.
// לפרודקשן אמיתי יש להשתמש ב-Vercel KV / Upstash Redis.
const WINDOW_MS = 60_000; // חלון של דקה
const MAX_REQ = 30; // בקשות מקסימום לחלון לכל IP
const hits = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
    }
    return true;
  }
  if (entry.count >= MAX_REQ) return false;
  entry.count++;
  return true;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ plate: string }> }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "יותר מדי בקשות. נסה שוב בעוד דקה." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { plate } = await params;

  if (!/^\d{5,8}$/.test(plate)) {
    return NextResponse.json(
      { error: "מספר רישוי לא תקין. יש להזין 5-8 ספרות." },
      { status: 400 }
    );
  }

  try {
    const result = await fetchVehicleByPlate(plate);

    if (!result) {
      return NextResponse.json(
        { error: "הרכב לא נמצא במאגרי משרד התחבורה." },
        { status: 404 }
      );
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    console.error("[vehicle API]", err);
    return NextResponse.json(
      { error: "שגיאה בשליפת הנתונים. נסה שוב בעוד מספר שניות." },
      { status: 502 }
    );
  }
}
