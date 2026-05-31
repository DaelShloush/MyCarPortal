"use client";

import { useEffect } from "react";
import { addGuestHistory, type GuestHistoryItem } from "@/lib/guest-history";
import { recordSearchHistory } from "@/app/actions/search-history";

interface Props {
  isLoggedIn: boolean;
  item: GuestHistoryItem;
}

// רושם את החיפוש:
// - משתמש מחובר → Supabase (דרך server action)
// - אורח → localStorage
export function SearchHistoryTracker({ isLoggedIn, item }: Props) {
  useEffect(() => {
    if (isLoggedIn) {
      void recordSearchHistory(item.plate, {
        manufacturer: item.manufacturer,
        model: item.model,
        year: item.year,
        riskScore: item.riskScore,
        riskTone: item.riskTone,
      });
    } else {
      addGuestHistory(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.plate, isLoggedIn]);

  return null;
}
