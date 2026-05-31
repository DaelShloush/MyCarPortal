"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateInsuranceAction } from "@/app/actions/vehicle";

interface Props {
  vehicleId: string;
  expiryDate: string | null; // YYYY-MM-DD
  cost: number | null;
}

function fmt(d: string | null): string {
  if (!d) return "לא הוגדר";
  try {
    return new Date(d).toLocaleDateString("he-IL");
  } catch {
    return d;
  }
}

function daysLeft(d: string | null): number | null {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export function InsuranceEditor({ vehicleId, expiryDate, cost }: Props) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(expiryDate ?? "");
  const [price, setPrice] = useState(cost ? String(cost) : "");
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      const res = await updateInsuranceAction(
        vehicleId,
        date || null,
        price ? parseInt(price, 10) : null
      );
      setToast(res.message);
      setTimeout(() => setToast(null), 3000);
      if (res.ok) setEditing(false);
    });
  }

  const days = daysLeft(expiryDate);

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-50)] grid place-items-center text-[var(--color-primary-700)]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="font-bold text-sm">ביטוח</p>
            <p className="text-xs text-[var(--color-text-subtle)]">
              {expiryDate ? (
                <>
                  בתוקף עד {fmt(expiryDate)}
                  {days !== null && days >= 0 && ` · ${days} ימים`}
                  {cost ? ` · ₪${cost.toLocaleString()}` : ""}
                </>
              ) : (
                "לא הוזנו פרטי ביטוח"
              )}
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          <Pencil size={14} />
          {expiryDate ? "ערוך" : "הוסף"}
        </Button>
        {toast && (
          <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-gray-900)] text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">תאריך חידוש ביטוח</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">עלות שנתית (₪)</label>
          <Input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="למשל: 3200"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={pending}>
          <Check size={14} /> {pending ? "שומר..." : "שמור"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
          <X size={14} /> ביטול
        </Button>
      </div>
    </div>
  );
}
