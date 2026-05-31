import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleImageProps {
  manufacturer: string;
  model: string;
  className?: string;
}

/**
 * תמונת רכב — בשלב static placeholder.
 * בשלב 8 נחבר ל-imagin.studio CGI.
 */
export function VehicleImage({ manufacturer, model, className }: VehicleImageProps) {
  return (
    <div
      className={cn(
        "relative w-full h-48 md:h-64 rounded-xl bg-gradient-to-br from-[var(--color-gray-100)] to-[var(--color-gray-200)] overflow-hidden grid place-items-center",
        className
      )}
      role="img"
      aria-label={`${manufacturer} ${model}`}
    >
      <Car size={96} className="text-[var(--color-gray-400)]" strokeWidth={1.5} />
      <span className="absolute bottom-3 end-3 text-xs px-2 py-1 rounded-md bg-white/80 backdrop-blur text-[var(--color-gray-600)] font-medium">
        {manufacturer} {model}
      </span>
    </div>
  );
}
