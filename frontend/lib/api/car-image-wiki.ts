// תמונת דגם אמיתית מוויקיפדיה (Wikimedia Commons) — חינם, איכותית, ללא סימן מים.
// מחליפה את ה-render של imagin.studio (שבגרסת הדמו מוטבע עליו watermark גדול).
// ה-fallback בצד הלקוח: ויקיפדיה → imagin → placeholder (ראה vehicle-image.tsx).
//
// rate limit: ויקיפדיה חוסמת שאילתות אגרסיביות (429) — לכן cache שבועי לכל
// צמד יצרן+דגם, ושאילתה אחת בלבד לכל דוח.

interface WikiPage {
  title?: string;
  thumbnail?: { source?: string; width?: number };
}

export async function fetchWikiCarImage(
  makeSlug: string,
  model: string
): Promise<string | null> {
  if (!makeSlug || !model) return null;

  const query = `${makeSlug} ${model}`.trim();
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "1",
    gsrnamespace: "0",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "1000",
    origin: "*",
  });

  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": "MyCarPortal/1.0 (educational project)" },
      next: { revalidate: 604800 }, // שבוע — תמונת דגם לא משתנה
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      query?: { pages?: Record<string, WikiPage> };
    };
    const pages = Object.values(json.query?.pages ?? {});
    const page = pages[0];
    const src = page?.thumbnail?.source;
    if (!src || (page?.thumbnail?.width ?? 0) < 400) return null;

    // הגנה מתוצאה לא רלוונטית: אם נמצא עמוד היצרן עצמו (ולא עמוד דגם),
    // התמונה תהיה לוגו — מדלגים ונופלים ל-imagin
    const normalizedTitle = (page.title ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const normalizedMake = makeSlug.replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (!normalizedTitle || normalizedTitle === normalizedMake) return null;
    if (/logo/i.test(src)) return null;

    return src;
  } catch {
    return null; // בעיה ברשת/429 — ניפול ל-imagin בצד הלקוח
  }
}
