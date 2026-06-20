import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { recognizePlate, getAnthropicKey, type OcrMediaType } from "@/lib/ocr";

// ════════════════════════════════════════════════════════════
// זיהוי לוחית רישוי מתמונה — Claude Haiku Vision, מגודר בעלות.
//
// שכבות הגנה מפני התפרצות עלויות:
//   1. הגבלת הוצאה ב-Anthropic Console (מחוץ לקוד — התקרה הקשיחה האמיתית)
//   2. מכסה יומית גלובלית (Supabase RPC אטומי) — DAILY_CAP קריאות ליום סך הכל
//   3. הגבלה לפי IP (in-memory) — מונע התעללות מנקודה אחת
//   4. מגבלת גודל תמונה — דוחה payload ענק
// ════════════════════════════════════════════════════════════

const DAILY_CAP = 300;          // תקרה גלובלית ליום (≈ $0.36 ליום במקרה הקיצוני)
const PER_IP_MAX = 5;           // קריאות מקס' לכל IP בחלון
const PER_IP_WINDOW_MS = 120_000; // חלון של שתי דקות
const MAX_IMAGE_BYTES = 1_500_000; // ~1.5MB (הקליינט מקטין — אמיתי בד"כ < 150KB)

const ALLOWED_TYPES: OcrMediaType[] = ["image/jpeg", "image/png", "image/webp"];

// ─── הגבלה לפי IP (best-effort; מתאפס בין instances ב-serverless) ───
const ipHits = new Map<string, { count: number; reset: number }>();
function ipRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.reset) {
    ipHits.set(ip, { count: 1, reset: now + PER_IP_WINDOW_MS });
    if (ipHits.size > 5000) {
      for (const [k, v] of ipHits) if (now > v.reset) ipHits.delete(k);
    }
    return true;
  }
  if (entry.count >= PER_IP_MAX) return false;
  entry.count++;
  return true;
}

// ─── מכסה יומית גלובלית דרך Supabase (אטומי). fail-open אם לא זמין ───
async function checkDailyCap(): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    // אין service key — נסמוך על הגבלת ה-IP + תקרת ה-Console. לא חוסמים.
    return { ok: true };
  }
  try {
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await admin.rpc("bump_ocr_usage", { p_max: DAILY_CAP });
    if (error) {
      console.warn("[ocr] daily-cap RPC failed (fail-open):", error.message);
      return { ok: true };
    }
    if (typeof data === "number" && data < 0) {
      return { ok: false, reason: "המכסה היומית של זיהוי תמונה נוצלה. אפשר להקליד את המספר ידנית." };
    }
    return { ok: true };
  } catch (e) {
    console.warn("[ocr] daily-cap exception (fail-open):", e);
    return { ok: true };
  }
}

export async function POST(req: NextRequest) {
  // אין מפתח AI מוגדר → הפיצ'ר כבוי בעדינות (הקליינט יסתיר את הכפתור ממילא)
  if (!getAnthropicKey()) {
    return NextResponse.json(
      { error: "זיהוי תמונה אינו זמין כרגע. אפשר להקליד את המספר ידנית." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!ipRateLimit(ip)) {
    return NextResponse.json(
      { error: "יותר מדי ניסיונות. נסה שוב בעוד דקה או הקלד ידנית." },
      { status: 429, headers: { "Retry-After": "120" } }
    );
  }

  let body: { image?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה." }, { status: 400 });
  }

  const { image, mediaType } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "לא צורפה תמונה." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(mediaType as OcrMediaType)) {
    return NextResponse.json({ error: "סוג תמונה לא נתמך." }, { status: 400 });
  }
  // אורך base64 ≈ 4/3 מגודל הקובץ — בדיקת גודל לפני כל עיבוד
  if (image.length > (MAX_IMAGE_BYTES * 4) / 3) {
    return NextResponse.json({ error: "התמונה גדולה מדי." }, { status: 413 });
  }

  // מכסה יומית גלובלית — אחרי שעברנו את כל הבדיקות הזולות
  const cap = await checkDailyCap();
  if (!cap.ok) {
    return NextResponse.json({ error: cap.reason }, { status: 429 });
  }

  try {
    const result = await recognizePlate(image, mediaType as OcrMediaType);
    if (!result.plate) {
      return NextResponse.json(
        { error: "לא זוהתה לוחית רישוי בתמונה. נסה תמונה ברורה יותר או הקלד ידנית." },
        { status: 422 }
      );
    }
    return NextResponse.json({ plate: result.plate });
  } catch (err) {
    console.error("[ocr]", err);
    return NextResponse.json(
      { error: "שגיאה בזיהוי התמונה. נסה שוב או הקלד ידנית." },
      { status: 502 }
    );
  }
}
