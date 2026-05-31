import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendReminderEmail } from "@/lib/email";

// Vercel Cron יומי — בודק תזכורות שמתקרבות ושולח אימייל.
// דורש: SUPABASE_SERVICE_ROLE_KEY (קריאה חוצת-משתמשים) + RESEND_API_KEY (שליחה).
// מאובטח עם CRON_SECRET (Vercel שולח אוטומטית Authorization: Bearer ...).

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // אימות קריאת ה-Cron
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({
      ok: false,
      reason: "SUPABASE_SERVICE_ROLE_KEY חסר — לא ניתן להריץ את הבדיקה",
    });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // תזכורות שטרם נשלח עליהן אימייל
  const { data: reminders, error } = await admin
    .from("reminders")
    .select("*")
    .eq("notified_email", false);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let sent = 0;
  let checked = 0;

  for (const r of reminders ?? []) {
    checked++;
    const due = new Date(r.due_date);
    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / 86400000);

    // בתוך חלון ההתראה ולא פג
    if (daysUntil < 0 || daysUntil > (r.notify_days_before ?? 30)) continue;

    const { data: u } = await admin.auth.admin.getUserById(r.user_id);
    const email = u?.user?.email;
    if (!email) continue;

    const ok = await sendReminderEmail(email, r, daysUntil);
    if (ok) {
      await admin.from("reminders").update({ notified_email: true }).eq("id", r.id);
      sent++;
    }
  }

  return NextResponse.json({ ok: true, checked, sent });
}
