"use client";

import { useEffect, useRef, useState } from "react";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildCarImageUrl } from "@/lib/car-image";

interface VehicleImageProps {
  manufacturer: string;
  model: string;
  year?: number | null;
  color?: string | null;
  /** תמונה מועדפת (ויקיפדיה — אמיתית וללא watermark); אם תיכשל ניפול ל-imagin */
  srcOverride?: string | null;
  /** hero = עמוד החיפוש (גדול), card = כרטיס בדשבורד/מועדפים (קטן) */
  variant?: "hero" | "card";
  className?: string;
}

/**
 * תמונת רכב מייצגת לפי דגם. שרשרת מקורות:
 * 1) srcOverride — צילום אמיתי מ-Wikimedia (נפתר בצד השרת, cache שבועי)
 * 2) imagin.studio — CGI render לפי יצרן/דגם/שנה/צבע (דמו עם watermark)
 * 3) placeholder עם אייקון
 * אין צילום של הרכב הספציפי במאגרים הציבוריים — זו תמונה מייצגת של הדגם.
 */
export function VehicleImage({
  manufacturer,
  model,
  year,
  color,
  srcOverride,
  variant = "hero",
  className,
}: VehicleImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [overrideFailed, setOverrideFailed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imaginUrl = buildCarImageUrl({
    manufacturer,
    model,
    year,
    color,
    width: variant === "hero" ? 800 : 400,
  });

  const usingWiki = !!srcOverride && !overrideFailed;
  const url = usingWiki ? srcOverride : imaginUrl;

  function advanceFallback() {
    // שרשרת fallback: ויקיפדיה נכשלה → imagin → placeholder
    if (usingWiki) {
      setOverrideFailed(true);
      setLoaded(false);
    } else {
      setFailed(true);
    }
  }

  // התמונה מרונדרת ב-SSR — אם הטעינה נכשלה (למשל חסימת CSP) לפני שה-React
  // התחבר לדף, אירוע onError כבר לא יגיע. בדיקה אחת אחרי mount סוגרת את החור.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth === 0) {
      advanceFallback();
    } else if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const heightClass =
    variant === "hero" ? "h-48 md:h-64" : "h-28";
  const iconSize = variant === "hero" ? 96 : 48;
  const showImage = url && !failed;

  return (
    <div
      className={cn(
        "relative w-full rounded-xl bg-gradient-to-br from-[var(--color-gray-100)] to-[var(--color-gray-200)] overflow-hidden grid place-items-center",
        heightClass,
        className
      )}
      role="img"
      aria-label={`${manufacturer} ${model}${year ? ` ${year}` : ""}`}
    >
      {showImage ? (
        <>
          {/* אייקון רקע עד שהתמונה נטענת */}
          {!loaded && (
            <Car
              size={iconSize}
              className="text-[var(--color-gray-300)] animate-pulse"
              strokeWidth={1.5}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            key={url}
            src={url}
            alt={`${manufacturer} ${model}${year ? ` ${year}` : ""}`}
            loading={variant === "hero" ? "eager" : "lazy"}
            fetchPriority={variant === "hero" ? "high" : "auto"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={advanceFallback}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-300",
              // צילום אמיתי ממלא את המסגרת; CGI שקוף נשאר contain
              usingWiki ? "object-cover" : "object-contain",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </>
      ) : (
        <Car
          size={iconSize}
          className="text-[var(--color-gray-400)]"
          strokeWidth={1.5}
        />
      )}

      {variant === "hero" && (
        <span className="absolute bottom-3 end-3 text-xs px-2 py-1 rounded-md bg-white/80 backdrop-blur text-[var(--color-gray-600)] font-medium z-10">
          {manufacturer} {model}
          {usingWiki && loaded && (
            <span className="text-[9px] opacity-70"> · Wikimedia</span>
          )}
        </span>
      )}
    </div>
  );
}
