import { Check, X } from "lucide-react";
import type { SafetyFeatures } from "@/lib/types";

interface SafetyGridProps {
  safety: SafetyFeatures;
}

const FEATURES: { key: keyof SafetyFeatures; label: string }[] = [
  { key: "abs", label: "ABS" },
  { key: "esp", label: "בקרת יציבות" },
  { key: "laneAssist", label: "בקרת סטייה מנתיב" },
  { key: "collisionWarning", label: "ניטור מרחק / התנגשות" },
  { key: "pedestrianDetect", label: "זיהוי הולכי רגל" },
  { key: "reverseCamera", label: "מצלמת רוורס" },
  { key: "emergencyBrake", label: "מערכת עזר לבלימה" },
  { key: "blindSpot", label: "זיהוי שטח מת" },
  { key: "autoLights", label: "אורות גבוהים אוטומטיים" },
  { key: "adaptiveCruise", label: "בקרת שיוט אדפטיבית" },
  { key: "trafficSignRecognition", label: "זיהוי תמרורים" },
  { key: "tirePressure", label: "חיישני לחץ אוויר" },
  { key: "seatbeltReminder", label: "חיישני חגורות" },
  { key: "reverseAeb", label: "בלימת חירום ברוורס" },
];

export function SafetyGrid({ safety }: SafetyGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 pb-3 border-b border-[var(--color-border)]">
        {safety.equipLevel != null && safety.equipLevel > 0 && (
          <div>
            <div className="text-xs text-[var(--color-text-subtle)]">רמת אבזור בטיחותי</div>
            <div className="text-2xl font-black text-[var(--color-primary-700)]">
              {safety.equipLevel}
              <span className="text-sm font-medium text-[var(--color-text-subtle)]">
                {" "}/ 8
              </span>
            </div>
          </div>
        )}
        {safety.airbags > 0 && (
          <div className="ms-auto text-end">
            <div className="text-xs text-[var(--color-text-subtle)]">כריות אוויר</div>
            <div className="text-2xl font-black text-[var(--color-primary-700)]">
              {safety.airbags}
            </div>
          </div>
        )}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {FEATURES.map((f) => {
          const has = safety[f.key] as boolean;
          return (
            <li key={f.key} className="flex items-center gap-2 text-sm">
              {has ? (
                <Check size={18} className="text-[var(--color-success)]" />
              ) : (
                <X size={18} className="text-[var(--color-gray-400)]" />
              )}
              <span className={has ? "text-[var(--color-text)]" : "text-[var(--color-text-subtle)]"}>
                {f.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
