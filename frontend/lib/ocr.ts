// זיהוי מספר לוחית רישוי מתמונה — Claude Haiku Vision.
// מודל זול במיוחד (Haiku 4.5: $1/$5 למיליון טוקנים) — סריקה בודדת ≈ 0.4 אגורות.
// פלט קצר בכוונה (רק הספרות) כדי לצמצם טוקני פלט לכמה עשרות.

import Anthropic from "@anthropic-ai/sdk";

export type OcrMediaType = "image/jpeg" | "image/png" | "image/webp";

export interface OcrResult {
  plate: string | null; // 5-8 ספרות, או null אם לא זוהתה לוחית
}

const MODEL = "claude-haiku-4-5";

// מפתח Anthropic — תומך בשם הסטנדרטי וגם בשם החלופי שהוגדר ב-Vercel.
export function getAnthropicKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY ?? process.env.api_key_claude;
}

const PROMPT = `בתמונה מופיעה לוחית רישוי ישראלית (רקע צהוב, ספרות שחורות, לעיתים עם פס IL כחול).
החזר אך ורק את הספרות של מספר הרישוי, ברצף, ללא מקפים, רווחים, אותיות או טקסט נוסף.
אם אינך מזהה לוחית רישוי ברורה בתמונה, החזר את המילה NONE בלבד.`;

/**
 * מזהה מספר רישוי מתמונת base64. מחזיר את הספרות בלבד או null.
 * זורק אם אין מפתח API או אם הקריאה נכשלה (ה-route מטפל בשגיאה).
 */
export async function recognizePlate(
  base64Image: string,
  mediaType: OcrMediaType
): Promise<OcrResult> {
  const apiKey = getAnthropicKey();
  if (!apiKey) {
    throw new Error("Anthropic API key missing");
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16, // הפלט הוא רק ספרות — תקרה נמוכה חוסכת עלות
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Image },
          },
          { type: "text", text: PROMPT },
        ],
      },
    ],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("")
    .trim();

  // חילוץ רצף 5-8 ספרות — גם אם המודל הוסיף תו כלשהו
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 5 && digits.length <= 8) {
    return { plate: digits };
  }
  return { plate: null };
}
