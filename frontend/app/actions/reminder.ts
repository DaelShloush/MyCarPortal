"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./favorites";

interface CreateReminderInput {
  vehicleId: string;
  type: "test" | "insurance" | "custom";
  title: string;
  dueDate: string; // YYYY-MM-DD
  notifyDaysBefore: number;
}

export async function createReminderAction(
  input: CreateReminderInput
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "יש להתחבר", needAuth: true };

  if (!input.dueDate) {
    return { ok: false, message: "חסר תאריך יעד" };
  }

  // אימות בעלות על הרכב
  const { data: veh } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", input.vehicleId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!veh) return { ok: false, message: "הרכב לא נמצא" };

  const { error } = await supabase.from("reminders").insert({
    user_id: user.id,
    vehicle_id: input.vehicleId,
    type: input.type,
    title: input.title || (input.type === "test" ? "חידוש טסט" : input.type === "insurance" ? "חידוש ביטוח" : "תזכורת"),
    due_date: input.dueDate,
    notify_days_before: input.notifyDaysBefore || 30,
  });

  if (error) return { ok: false, message: `שגיאה: ${error.message}` };

  revalidatePath(`/vehicle/${input.vehicleId}`);
  revalidatePath("/dashboard");
  return { ok: true, message: "התזכורת נוצרה ✓" };
}

export async function deleteReminderAction(
  reminderId: string,
  vehicleId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "יש להתחבר", needAuth: true };

  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId)
    .eq("user_id", user.id);

  if (error) return { ok: false, message: `שגיאה: ${error.message}` };

  revalidatePath(`/vehicle/${vehicleId}`);
  revalidatePath("/dashboard");
  return { ok: true, message: "התזכורת הוסרה" };
}
