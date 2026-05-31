"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManufacturerLogoProps {
  slug: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * לוגו יצרן מ-avto-dev/vehicle-logotypes (מתארח ב-vl.imgix.net).
 * נטען לפי slug; אם אין slug או הטעינה נכשלת — fallback לאייקון אחיד.
 */
export function ManufacturerLogo({ slug, name, size = 40, className }: ManufacturerLogoProps) {
  const [failed, setFailed] = useState(false);

  // imgix: גודל כפול ל-retina, שמירת שקיפות ויחס
  const px = size * 2;
  const url = slug
    ? `https://vl.imgix.net/img/${slug}-logo.png?w=${px}&h=${px}&fit=clip&auto=format`
    : null;

  return (
    <div
      aria-label={name}
      className={cn(
        "shrink-0 rounded-lg bg-white border border-[var(--color-border)] grid place-items-center text-[var(--color-gray-500)] overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      {url && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <Car size={Math.round(size * 0.55)} strokeWidth={2} />
      )}
    </div>
  );
}
