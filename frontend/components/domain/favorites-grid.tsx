"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/domain/risk-badge";
import { VehicleImage } from "@/components/domain/vehicle-image";
import { toneFromScore } from "@/lib/risk";
import { cn } from "@/lib/utils";

interface FavoriteItem {
  id: string;
  license_plate: string;
  notes: string | null;
  added_at: string;
  manufacturer: string;
  model: string;
  year: number | null;
  riskScore: number;
}

interface Props {
  items: FavoriteItem[];
  maxCompare: number;
}

export function FavoritesGrid({ items, maxCompare }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(plate: string) {
    setSelected((prev) => {
      if (prev.includes(plate)) return prev.filter((p) => p !== plate);
      if (prev.length >= maxCompare) return prev; // הגעת למגבלה
      return [...prev, plate];
    });
  }

  function compare() {
    if (selected.length < 2) return;
    router.push(`/compare?plates=${selected.join(",")}`);
  }

  const atLimit = selected.length >= maxCompare;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((fav) => {
          const tone = toneFromScore(fav.riskScore);
          const isSelected = selected.includes(fav.license_plate);
          const disabled = atLimit && !isSelected;
          return (
            <Card
              key={fav.id}
              className={cn(
                "p-4 h-full relative transition-shadow",
                isSelected
                  ? "ring-2 ring-[var(--color-primary-500)]"
                  : "hover:shadow-[var(--shadow-md)]"
              )}
            >
              {/* צ'קבוקס בחירה להשוואה */}
              <button
                type="button"
                onClick={() => toggle(fav.license_plate)}
                disabled={disabled}
                aria-label={isSelected ? "הסר מהשוואה" : "הוסף להשוואה"}
                className={cn(
                  "absolute top-3 start-3 w-6 h-6 rounded-md border grid place-items-center transition-colors z-10",
                  isSelected
                    ? "bg-[var(--color-primary-600)] border-[var(--color-primary-600)] text-white"
                    : disabled
                      ? "border-[var(--color-border)] opacity-40 cursor-not-allowed"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary-400)] bg-white"
                )}
              >
                {isSelected && <Check size={14} />}
              </button>

              <Link href={`/search/${fav.license_plate}`} className="block">
                <VehicleImage
                  manufacturer={fav.manufacturer}
                  model={fav.model}
                  year={fav.year}
                  variant="card"
                  className="mb-3"
                />
                <div className="flex items-start justify-between gap-2 mb-3 ps-8">
                  <div>
                    <p className="font-bold text-[var(--color-gray-900)]">
                      {fav.manufacturer} {fav.model}
                    </p>
                    <p className="text-xs text-[var(--color-text-subtle)] plate-text mt-0.5">
                      {fav.license_plate}
                      {fav.year ? ` · ${fav.year}` : ""}
                    </p>
                  </div>
                  <RiskBadge score={fav.riskScore} tone={tone} size="sm" showLabel={false} />
                </div>
                {fav.notes && (
                  <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] rounded-lg px-3 py-2">
                    {fav.notes}
                  </p>
                )}
                <p className="text-xs text-[var(--color-text-subtle)] mt-3">
                  נשמר: {new Date(fav.added_at).toLocaleDateString("he-IL")}
                </p>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* פס השוואה צף */}
      {selected.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-gray-900)] text-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-4">
          <span className="text-sm">
            {selected.length} נבחרו
            <span className="text-[var(--color-gray-400)]">
              {" "}
              (עד {maxCompare})
            </span>
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={compare}
            disabled={selected.length < 2}
          >
            <Scale size={16} />
            השווה
          </Button>
          <button
            onClick={() => setSelected([])}
            aria-label="נקה בחירה"
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
