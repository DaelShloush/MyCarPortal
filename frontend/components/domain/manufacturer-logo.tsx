import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManufacturerLogoProps {
  slug: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * לוגו יצרן — מאחר ולוגואים חיצוניים תלויי-רשת,
 * בשלב ה-static הזה אנחנו מציגים אייקון fallback אחיד.
 * בשלב 8 (Backend) נחבר ל-avto-dev/vehicle-logotypes CDN.
 */
export function ManufacturerLogo({ name, size = 40, className }: ManufacturerLogoProps) {
  return (
    <div
      aria-label={name}
      className={cn(
        "shrink-0 rounded-lg bg-white border border-[var(--color-border)] grid place-items-center text-[var(--color-gray-500)]",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Car size={Math.round(size * 0.55)} strokeWidth={2} />
    </div>
  );
}
