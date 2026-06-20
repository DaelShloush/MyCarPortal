"use client";

// כפתור "סרוק לוחית" — צילום/בחירת תמונה → הקטנה בצד הלקוח → /api/ocr → מספר רישוי.
// ההקטנה ל-512px קריטית: היא חוסכת עלות (פחות טוקני vision) וגם תעבורה.
// מוצג רק כש-NEXT_PUBLIC_OCR_ENABLED=1 (כלומר מפתח ה-AI הוגדר בשרת).

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

// קצה ארוך מקסימלי לתמונה שנשלחת ל-AI. 1000px נותן קריאוּת טובה לצילום אמיתי
// (שבו הלוחית לרוב חלק קטן מהפריים) — והעלות עדיין זניחה (~0.5 אג' לסריקה).
const MAX_DIM = 1000;

interface PlateScanButtonProps {
  onDetected: (plate: string) => void;
  onError?: (message: string) => void;
  className?: string;
}

/** האם הפיצ'ר מופעל (מפתח AI הוגדר). נקבע ב-build לפי משתנה הסביבה. */
export const OCR_ENABLED = process.env.NEXT_PUBLIC_OCR_ENABLED === "1";

async function downscaleToBase64(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
  return dataUrl.split(",")[1]; // מסיר את הקידומת "data:image/jpeg;base64,"
}

export function PlateScanButton({ onDetected, onError, className }: PlateScanButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // לאפשר בחירה חוזרת של אותו קובץ
    if (!file) return;

    setBusy(true);
    try {
      const image = await downscaleToBase64(file);
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mediaType: "image/jpeg" }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError?.(data.error ?? "זיהוי נכשל. נסה שוב או הקלד ידנית.");
        return;
      }
      onDetected(data.plate as string);
    } catch {
      onError?.("לא ניתן לעבד את התמונה. נסה תמונה אחרת או הקלד ידנית.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label="סרוק לוחית רישוי מתמונה"
        title="סרוק לוחית מתמונה"
        className={
          className ??
          "shrink-0 w-10 h-10 grid place-items-center rounded-xl text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] disabled:opacity-50 transition-colors"
        }
      >
        {busy ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        aria-hidden="true"
      />
    </>
  );
}
