"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trash2, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/domain/risk-badge";
import { toneFromScore } from "@/lib/risk";
import {
  getGuestHistory,
  clearGuestHistory,
  type GuestHistoryItem,
} from "@/lib/guest-history";

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "היום";
  if (days === 1) return "אתמול";
  if (days < 7) return `לפני ${days} ימים`;
  if (days < 30) return `לפני ${Math.floor(days / 7)} שבועות`;
  return d.toLocaleDateString("he-IL");
}

export function GuestHistoryList() {
  const [items, setItems] = useState<GuestHistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getGuestHistory());
    setLoaded(true);
  }, []);

  function handleClear() {
    clearGuestHistory();
    setItems([]);
  }

  if (!loaded) return null;

  return (
    <div>
      {/* באנר עידוד הרשמה */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] mb-6">
        <Info size={20} className="text-[var(--color-primary-600)] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-primary-800)]">
            ההיסטוריה נשמרת רק בדפדפן הזה
          </p>
          <p className="text-xs text-[var(--color-primary-700)] mt-0.5">
            <Link href="/register" className="underline font-medium">
              הירשם בחינם
            </Link>{" "}
            כדי לשמור את ההיסטוריה בכל מכשיר, להוסיף מועדפים ולנהל רכבים.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-subtle)]">
          <Clock size={40} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">עוד לא חיפשת רכבים</p>
          <Link
            href="/"
            className="text-[var(--color-primary-600)] hover:underline font-medium"
          >
            חיפוש ראשון →
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 size={14} /> נקה היסטוריה
            </Button>
          </div>
          <div className="space-y-2">
            {items.map((item) => {
              const tone = toneFromScore(item.riskScore);
              return (
                <Link key={item.plate} href={`/search/${item.plate}`}>
                  <Card className="p-4 flex items-center gap-4 hover:shadow-[var(--shadow-sm)] transition-shadow cursor-pointer">
                    <RiskBadge
                      score={item.riskScore}
                      tone={tone}
                      size="sm"
                      showLabel={false}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--color-gray-900)] truncate">
                        {item.manufacturer} {item.model}
                        {item.year ? ` ${item.year}` : ""}
                      </p>
                      <p className="text-xs text-[var(--color-text-subtle)] plate-text">
                        {item.plate}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--color-text-subtle)] shrink-0">
                      {formatRelative(item.searchedAt)}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
