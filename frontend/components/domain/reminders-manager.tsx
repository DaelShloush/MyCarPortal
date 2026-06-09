"use client";

import { useState, useTransition } from "react";
import { Bell, Plus, Trash2, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReminderAction, deleteReminderAction } from "@/app/actions/reminder";

interface ReminderItem {
  id: string;
  type: string;
  title: string | null;
  due_date: string;
  notify_days_before: number | null;
}

interface Props {
  vehicleId: string;
  initialReminders: ReminderItem[];
  testExpiry: string | null; // YYYY-MM-DD
  insuranceExpiry: string | null;
}

const TYPE_LABEL: Record<string, string> = {
  test: "טסט",
  insurance: "ביטוח",
  custom: "מותאם",
};

export function RemindersManager({
  vehicleId,
  initialReminders,
  testExpiry,
  insuranceExpiry,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDate, setCustomDate] = useState("");

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function create(
    type: "test" | "insurance" | "custom",
    title: string,
    dueDate: string
  ) {
    startTransition(async () => {
      const res = await createReminderAction({
        vehicleId,
        type,
        title,
        dueDate,
        notifyDaysBefore: 30,
      });
      notify(res.message);
      if (res.ok) {
        setShowCustom(false);
        setCustomTitle("");
        setCustomDate("");
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteReminderAction(id, vehicleId);
      notify(res.message);
    });
  }

  const hasTest = initialReminders.some((r) => r.type === "test");
  const hasInsurance = initialReminders.some((r) => r.type === "insurance");

  return (
    <div className="space-y-3">
      {/* רשימת תזכורות קיימות */}
      {initialReminders.length > 0 && (
        <ul className="space-y-2">
          {initialReminders.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-50)] grid place-items-center text-[var(--color-primary-700)]">
                  <Bell size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm">
                    {r.title ?? `חידוש ${TYPE_LABEL[r.type] ?? ""}`}
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)]">
                    {new Date(r.due_date).toLocaleDateString("he-IL")} · התראה{" "}
                    {r.notify_days_before ?? 30} ימים לפני · אימייל
                  </p>
                </div>
              </div>
              <button
                onClick={() => remove(r.id)}
                disabled={pending}
                aria-label="מחק תזכורת"
                className="w-8 h-8 grid place-items-center rounded-lg hover:bg-red-50 text-[var(--color-danger)]"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* כפתורי הוספה מהירה */}
      <div className="flex flex-wrap gap-2">
        {testExpiry && !hasTest && (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => create("test", "חידוש טסט", testExpiry)}
          >
            <Plus size={14} /> תזכורת טסט
          </Button>
        )}
        {insuranceExpiry && !hasInsurance && (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => create("insurance", "חידוש ביטוח", insuranceExpiry)}
          >
            <Plus size={14} /> תזכורת ביטוח
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => setShowCustom((s) => !s)}
        >
          <Plus size={14} /> תזכורת מותאמת
        </Button>
      </div>

      {/* טופס תזכורת מותאמת */}
      {showCustom && (
        <div className="rounded-lg border border-[var(--color-border)] p-3 space-y-3">
          <Input
            placeholder="כותרת (למשל: החלפת צמיגים)"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-[var(--color-text-subtle)] flex items-center gap-1 mb-1">
                <Calendar size={12} /> תאריך יעד
              </label>
              <Input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              disabled={pending || !customDate || !customTitle.trim()}
              onClick={() => create("custom", customTitle.trim(), customDate)}
            >
              <Check size={14} /> צור
            </Button>
          </div>
        </div>
      )}

      {initialReminders.length === 0 && !showCustom && (
        <p className="text-xs text-[var(--color-text-subtle)]">
          צור תזכורת ותקבל התראת אימייל לפני המועד.
        </p>
      )}

      <p className="text-[11px] text-[var(--color-text-muted)] pt-1">
        * התראות אימייל פעילות בכפוף להגדרת השרת (Resend + Cron).
      </p>

      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-gray-900)] text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
