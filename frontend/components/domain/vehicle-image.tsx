"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildCarImageUrl } from "@/lib/car-image";

interface VehicleImageProps {
  manufacturer: string;
  model: string;
  year?: number | null;
  color?: string | null;
  /** hero = עמוד החיפוש (גדול), card = כרטיס בדשבורד/מועדפים (קטן) */
  variant?: "hero" | "card";
  className?: string;
}

/**
 * תמונת רכב — render מייצג לפי דגם מ-imagin.studio.
 * אין צילום של הרכב הספציפי במאגרים הציבוריים; זו תמונה לפי יצרן/דגם/שנה/צבע.
 * אם אין נתונים מספיקים או הטעינה נכשלת — נופל ל-placeholder עם אייקון.
 */
export function VehicleImage({
  manufacturer,
  model,
  year,
  color,
  variant = "hero",
  className,
}: VehicleImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const url = buildCarImageUrl({
    manufacturer,
    model,
    year,
    color,
    width: variant === "hero" ? 800 : 400,
  });

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
            src={url}
            alt={`${manufacturer} ${model}${year ? ` ${year}` : ""}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={cn(
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
        </span>
      )}
    </div>
  );
}
