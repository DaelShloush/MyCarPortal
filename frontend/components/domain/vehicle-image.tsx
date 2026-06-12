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
  /** צילום אמיתי מ-Wikimedia — משמש כ-fallback כשאין render של imagin */
  fallbackSrc?: string | null;
  /** hero = עמוד החיפוש (גדול), card = כרטיס בדשבורד/מועדפים (קטן) */
  variant?: "hero" | "card";
  className?: string;
}

/**
 * תמונת רכב מייצגת לפי דגם. שרשרת מקורות:
 * 1) imagin.studio — CGI לפי יצרן/דגם/שנה/צבע: צבע נכון, מראה אולפן אחיד
 *    (בדמו יש watermark; מפתח בתשלום ב-NEXT_PUBLIC_IMAGIN_CUSTOMER מסיר אותו)
 * 2) Wikimedia — צילום אמיתי של הדגם, רק אם ל-imagin אין render
 *    (צבע וזווית לא מותאמים — לכן fallback בלבד)
 * 3) placeholder עם אייקון
 * אין צילום של הרכב הספציפי במאגרים הציבוריים — זו תמונה מייצגת של הדגם.
 */
export function VehicleImage({
  manufacturer,
  model,
  year,
  color,
  fallbackSrc,
  variant = "hero",
  className,
}: VehicleImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imaginFailed, setImaginFailed] = useState(false);
  const [wikiFailed, setWikiFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imaginUrl = buildCarImageUrl({
    manufacturer,
    model,
    year,
    color,
    width: variant === "hero" ? 800 : 400,
  });

  // שרשרת המקורות: imagin → ויקיפדיה → placeholder
  const usingImagin = !!imaginUrl && !imaginFailed;
  const usingWiki = !usingImagin && !!fallbackSrc && !wikiFailed;
  const url = usingImagin ? imaginUrl : usingWiki ? fallbackSrc : null;

  function advanceFallback() {
    setLoaded(false);
    if (usingImagin) setImaginFailed(true);
    else if (usingWiki) setWikiFailed(true);
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
      {url ? (
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
              // contain תמיד — אף תמונה לא נחתכת, צילום אמיתי מקבל letterbox עדין
              "absolute inset-0 w-full h-full object-contain transition-opacity duration-300",
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
