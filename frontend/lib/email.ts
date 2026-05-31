// שליחת אימייל דרך Resend (REST API — ללא SDK).
// דורש RESEND_API_KEY. אם לא מוגדר — מדלג בשקט (לא קורס).

interface ReminderEmail {
  type: string;
  title: string | null;
  due_date: string;
}

const TYPE_LABEL: Record<string, string> = {
  test: "טסט",
  insurance: "ביטוח",
  custom: "תזכורת",
};

export async function sendReminderEmail(
  to: string,
  reminder: ReminderEmail,
  daysUntil: number
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "MyCarPortal <onboarding@resend.dev>";
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping send");
    return false;
  }

  const label = TYPE_LABEL[reminder.type] ?? "תזכורת";
  const title = reminder.title ?? `חידוש ${label}`;
  const dueFmt = new Date(reminder.due_date).toLocaleDateString("he-IL");

  const subject =
    daysUntil === 0
      ? `⏰ ${title} — היום!`
      : `⏰ ${title} — עוד ${daysUntil} ימים`;

  const html = `
  <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1e293b">
    <div style="background:#2c3e50;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0">
      <h1 style="margin:0;font-size:18px">MyCarPortal · תזכורת רכב</h1>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:0;padding:20px;border-radius:0 0 12px 12px">
      <p style="font-size:16px;font-weight:bold;margin:0 0 8px">${title}</p>
      <p style="margin:0 0 4px">מועד: <strong>${dueFmt}</strong></p>
      <p style="margin:0 0 16px;color:#64748b">
        ${daysUntil === 0 ? "המועד הוא היום!" : `נותרו ${daysUntil} ימים.`}
      </p>
      <p style="font-size:13px;color:#64748b;margin:0">
        קיבלת הודעה זו כי הגדרת תזכורת ב-MyCarPortal.
      </p>
    </div>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] send failed", e);
    return false;
  }
}
