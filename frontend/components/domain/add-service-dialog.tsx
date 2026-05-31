"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addServiceRecordAction } from "@/app/actions/service";

interface AddServiceDialogProps {
  vehicleId: string;
}

const SERVICE_TYPES = [
  { value: "oil", label: "החלפת שמן" },
  { value: "tires", label: "צמיגים" },
  { value: "brakes", label: "בלמים" },
  { value: "battery", label: "מצבר" },
  { value: "ac", label: "מזגן" },
  { value: "timing_belt", label: "רצועת תזמון" },
  { value: "general", label: "טיפול כללי" },
  { value: "accident_repair", label: "תיקון מתאונה" },
  { value: "other", label: "אחר" },
];

export function AddServiceDialog({ vehicleId }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const boundAction = addServiceRecordAction.bind(null, vehicleId);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await boundAction(formData);
    // redirect from server action closes this dialog automatically
    setPending(false);
    setOpen(false);
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={14} />
        טיפול חדש
      </Button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <h3 className="font-bold text-lg">הוספת טיפול חדש</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 grid place-items-center rounded-lg hover:bg-[var(--color-gray-100)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="p-5 space-y-4">
              {/* Service type */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  סוג טיפול <span className="text-[var(--color-danger)]">*</span>
                </label>
                <select
                  name="service_type"
                  required
                  className="w-full h-11 rounded-lg border border-[var(--color-border)] px-3 text-base bg-white focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
                >
                  <option value="">בחר סוג...</option>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  תיאור קצר <span className="text-[var(--color-danger)]">*</span>
                </label>
                <Input
                  name="title"
                  required
                  placeholder='למשל: "החלפת שמן 5W-30 סינטטי"'
                />
              </div>

              {/* Date + KM row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    תאריך <span className="text-[var(--color-danger)]">*</span>
                  </label>
                  <Input
                    name="service_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    ק״מ ברכב
                  </label>
                  <Input
                    name="km_at_service"
                    type="number"
                    min="0"
                    placeholder="למשל: 90000"
                  />
                </div>
              </div>

              {/* Cost + Garage row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    עלות (₪)
                  </label>
                  <Input
                    name="cost"
                    type="number"
                    min="0"
                    placeholder="למשל: 350"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    שם מוסך
                  </label>
                  <Input
                    name="garage_name"
                    placeholder="למשל: מוסך אבי"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  הערות (אופציונלי)
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="פרטים נוספים..."
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={pending}
                  className="flex-1"
                >
                  {pending ? "שומר..." : "שמור טיפול"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
