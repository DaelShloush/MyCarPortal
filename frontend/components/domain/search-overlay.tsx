"use client";

// חלון חיפוש מיידי — נפתח מכפתורי החיפוש בנייד (navbar עליון + ניווט תחתון).
// במקום ניווט לעמוד הבית וחיפוש ידני של תיבת הטקסט: נגיעה אחת → מקלדת פתוחה.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock } from "lucide-react";
import { validatePlate } from "@/lib/validators";
import { getGuestHistory, type GuestHistoryItem } from "@/lib/guest-history";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

/** עטיפה — הרכיב הפנימי נטען מחדש בכל פתיחה, כך שהשדה תמיד מתחיל ריק */
export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  if (!open) return null;
  return <SearchOverlayPanel onClose={onClose} />;
}

function SearchOverlayPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  // נטען פעם אחת ב-mount (הרכיב נהרס בסגירה) — רק בדפדפן, אחרי לחיצת משתמש
  const [recent] = useState<GuestHistoryItem[]>(() => getGuestHistory().slice(0, 4));

  useEffect(() => {
    // נעילת גלילת הרקע + פוקוס מיידי לשדה (פותח מקלדת בנייד)
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function go(plate: string) {
    onClose();
    router.push(`/search/${plate}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validatePlate(value);
    if (!result.valid) {
      setError(result.error ?? "מספר רישוי לא תקין");
      return;
    }
    go(result.cleaned);
  }

  return (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label="חיפוש רכב לפי מספר רישוי"
    >
      {/* רקע מוחשך — נגיעה סוגרת */}
      <button
        type="button"
        aria-label="סגירת חיפוש"
        onClick={onClose}
        className="absolute inset-0 w-full bg-black/40 backdrop-blur-[2px] cursor-default"
      />

      {/* גיליון עליון */}
      <div className="mcp-slide-down absolute inset-x-0 top-0 bg-white rounded-b-3xl shadow-[var(--shadow-lg)] px-4 pt-3 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-[var(--color-gray-900)]">
            חיפוש רכב
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגור"
            className="w-9 h-9 grid place-items-center rounded-lg hover:bg-[var(--color-gray-100)] text-[var(--color-gray-600)]"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className={`flex items-center gap-2 bg-white border-2 rounded-2xl px-3 h-14 transition-colors ${
            error
              ? "border-[var(--color-danger)]"
              : "border-[var(--color-primary-300)] focus-within:border-[var(--color-primary-600)]"
          }`}
        >
          <Search size={20} className="text-[var(--color-gray-400)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="הזן מספר רישוי..."
            aria-label="מספר רישוי"
            aria-invalid={!!error}
            className="plate-text flex-1 bg-transparent border-0 outline-none text-lg text-[var(--color-gray-900)] placeholder:text-[var(--color-gray-400)]"
          />
          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-[var(--color-primary-700)] text-white font-bold text-sm active:scale-95 transition-transform"
          >
            חפש
          </button>
        </form>
        {error ? (
          <p className="text-xs text-[var(--color-danger)] mt-1.5 ps-2" role="alert">
            {error}
          </p>
        ) : (
          <p className="text-[11px] text-[var(--color-text-subtle)] mt-1.5 ps-2">
            5–8 ספרות, ללא מקפים
          </p>
        )}

        {/* חיפושים אחרונים (אורח, localStorage) — נגיעה אחת חוזרת לרכב */}
        {recent.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-bold text-[var(--color-text-subtle)] mb-2 flex items-center gap-1">
              <Clock size={12} aria-hidden="true" />
              חיפושים אחרונים
            </p>
            <ul className="space-y-1">
              {recent.map((r) => (
                <li key={r.plate}>
                  <button
                    type="button"
                    onClick={() => go(r.plate)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--color-gray-100)] active:bg-[var(--color-primary-50)] text-start"
                  >
                    <span className="text-sm font-medium text-[var(--color-text)] truncate">
                      {r.manufacturer} {r.model} {r.year || ""}
                    </span>
                    <span className="plate-text text-xs font-bold text-[var(--color-text-subtle)] shrink-0 ms-3">
                      {r.plate}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
