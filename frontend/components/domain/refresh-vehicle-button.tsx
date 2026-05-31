"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refreshVehicleAction } from "@/app/actions/vehicle";

interface Props {
  vehicleId: string;
  lastSyncedAt: string | null;
}

function formatSynced(iso: string | null): string {
  if (!iso) return "לא סונכרן עדיין";
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return "עודכן היום";
  if (days === 1) return "עודכן אתמול";
  if (days < 30) return `עודכן לפני ${days} ימים`;
  return `עודכן ב-${d.toLocaleDateString("he-IL")}`;
}

export function RefreshVehicleButton({ vehicleId, lastSyncedAt }: Props) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function handleRefresh() {
    startTransition(async () => {
      const res = await refreshVehicleAction(vehicleId);
      setToast(res.message);
      setTimeout(() => setToast(null), 3500);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--color-text-subtle)]">
        {formatSynced(lastSyncedAt)}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={pending}
      >
        <RefreshCw size={14} className={pending ? "animate-spin" : ""} />
        {pending ? "מרענן..." : "רענן נתונים"}
      </Button>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-gray-900)] text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
