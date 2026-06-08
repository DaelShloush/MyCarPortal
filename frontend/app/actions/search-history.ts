"use server";

import { createClient } from "@/lib/supabase/server";

interface SearchSummary {
  manufacturer: string;
  model: string;
  year: number;
}

// שומר חיפוש בהיסטוריה של משתמש מחובר (אורחים נשמרים ב-localStorage).
// מסיר רשומה קודמת לאותו רכב כדי למנוע כפילויות.
export async function recordSearchHistory(
  plate: string,
  summary: SearchSummary
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // dedup — מוחק רשומה קיימת לאותו רכב, ואז מוסיף חדשה עם חותמת זמן עדכנית
  await supabase
    .from("search_history")
    .delete()
    .eq("user_id", user.id)
    .eq("license_plate", plate);

  await supabase.from("search_history").insert({
    user_id: user.id,
    license_plate: plate,
    result_summary: summary,
  });
}
