"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface VehicleSummary {
  manufacturer: string;
  model: string;
  year: number;
}

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; needAuth?: boolean };

export async function toggleFavoriteAction(
  plate: string,
  summary: VehicleSummary
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "יש להתחבר כדי לשמור למועדפים", needAuth: true };
  }

  // בדיקה אם כבר במועדפים
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("license_plate", plate)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    if (error) return { ok: false, message: "שגיאה בהסרה מהמועדפים" };
    revalidatePath("/favorites");
    return { ok: true, message: "הוסר מהמועדפים" };
  }

  // אכיפת מגבלת תוכנית — חינם עד 5 מועדפים, פרמיום ללא הגבלה
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const isPremium = profile?.plan === "premium";

  if (!isPremium) {
    const { count } = await supabase
      .from("favorites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= 5) {
      return {
        ok: false,
        message: "הגעת למגבלת 5 מועדפים בגרסה החינמית. שדרג לפרמיום למועדפים ללא הגבלה.",
      };
    }
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    license_plate: plate,
    cached_data: summary,
  });
  if (error) return { ok: false, message: "שגיאה בשמירה למועדפים" };
  revalidatePath("/favorites");
  return { ok: true, message: "נשמר למועדפים ⭐" };
}

export async function isFavoriteAction(plate: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("license_plate", plate)
    .maybeSingle();

  return !!data;
}
