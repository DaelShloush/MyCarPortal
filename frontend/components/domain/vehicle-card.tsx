import Link from "next/link";
import { ChevronLeft, FileSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ManufacturerLogo } from "./manufacturer-logo";
import { VehicleImage } from "./vehicle-image";
import type { MyVehicle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: MyVehicle;
}

function daysProgress(days: number) {
  // יותר ימים = יותר ירוק
  if (days >= 90) return { value: 100, tone: "good" as const, color: "text-[var(--color-success)]" };
  if (days >= 30) return { value: (days / 90) * 100, tone: "warn" as const, color: "text-[var(--color-warning)]" };
  return { value: Math.max((days / 30) * 100, 5), tone: "high" as const, color: "text-[var(--color-danger)]" };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const test = daysProgress(vehicle.daysToTestExpiry);
  const insurance = daysProgress(vehicle.daysToInsuranceExpiry);

  return (
    <Card className="hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <VehicleImage
        manufacturer={vehicle.manufacturer}
        model={vehicle.model}
        year={vehicle.year}
        color={vehicle.color}
        variant="card"
        className="rounded-none"
      />
      <div className="p-4 flex items-start gap-3">
        <ManufacturerLogo
          slug={vehicle.manufacturerSlug}
          name={vehicle.manufacturer}
          size={48}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[var(--color-gray-900)] truncate">
            {vehicle.nickname || `${vehicle.manufacturer} ${vehicle.model}`}
          </h3>
          <p className="text-sm text-[var(--color-text-subtle)] truncate">
            {vehicle.manufacturer} {vehicle.model} {vehicle.year}
          </p>
          <p className="text-xs text-[var(--color-text-subtle)] plate-text mt-0.5">
            {vehicle.plate}
          </p>
        </div>
      </div>

      <div className="px-4 pb-3 space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--color-text-subtle)]">טסט</span>
            <span className={cn("font-bold", test.color)}>
              {vehicle.daysToTestExpiry} ימים
            </span>
          </div>
          <Progress value={test.value} tone={test.tone} />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--color-text-subtle)]">ביטוח</span>
            <span className={cn("font-bold", insurance.color)}>
              {vehicle.daysToInsuranceExpiry} ימים
            </span>
          </div>
          <Progress value={insurance.value} tone={insurance.tone} />
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] grid grid-cols-2 [&>*+*]:border-s [&>*+*]:border-[var(--color-border)]">
        <Link
          href={`/vehicle/${vehicle.id}`}
          className="flex items-center justify-center gap-1 py-3 text-sm font-medium text-[var(--color-primary-600)] hover:bg-[var(--color-gray-50)]"
        >
          פרטים <ChevronLeft size={15} />
        </Link>
        <Link
          href={`/search/${vehicle.plate}`}
          className="flex items-center justify-center gap-1 py-3 text-sm font-medium text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]"
        >
          <FileSearch size={15} /> דוח מלא
        </Link>
      </div>
    </Card>
  );
}
