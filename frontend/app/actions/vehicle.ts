"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchVehicleByPlate } from "@/lib/api/vehicle-aggregator";
import type { ActionResult } from "./favorites";

interface AddVehicleInput {
  plate: string;
  manufacturer: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  ownerCount: number;
  lastTestDate: string | null;
  testExpiryDate: string | null;
  kmAtLastTest: number | null;
  structuralChange: boolean;
  colorChanged: boolean;
  firstRegistrationDate: string | null;
  hasOpenRecalls: boolean;
}

// ממיר תאריך עברי/חופשי לפורמט ISO (YYYY-MM-DD) או null
function toISODate(value: string | null): string | null {
  if (!value) return null;
  // פורמט MM/YYYY → YYYY-MM-01
  const mmYYYY = value.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYYYY) return `${mmYYYY[2]}-${mmYYYY[1].padStart(2, "0")}-01`;
  // פורמט DD/MM/YYYY → YYYY-MM-DD
  const dmy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  // כבר ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return null;
}

export async function addVehicleAction(
  input: AddVehicleInput
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "יש להתחבר כדי להוסיף רכב", needAuth: true };
  }

  // בדיקת הגבלת תוכנית (חינם = רכב 1, פרמיום = 3)
  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const limit = profile?.plan === "premium" ? 3 : 1;
  if ((count ?? 0) >= limit) {
    return {
      ok: false,
      message:
        limit === 1
          ? "הגעת למגבלת רכב אחד בתוכנית החינם. שדרג ל-Premium לעד 3 רכבים."
          : "הגעת למגבלת 3 רכבים.",
    };
  }

  // בדיקה אם כבר קיים
  const { data: existing } = await supabase
    .from("vehicles")
    .select("id")
    .eq("user_id", user.id)
    .eq("license_plate", input.plate)
    .maybeSingle();

  if (existing) {
    return { ok: false, message: "הרכב כבר נמצא ברשימת הרכבים שלך" };
  }

  const { error } = await supabase.from("vehicles").insert({
    user_id: user.id,
    license_plate: input.plate,
    manufacturer: input.manufacturer,
    model: input.model,
    year: input.year || null,
    color: input.color,
    fuel_type: input.fuelType,
    owner_count: input.ownerCount,
    last_test_date: toISODate(input.lastTestDate),
    test_expiry_date: toISODate(input.testExpiryDate),
    km_at_last_test: input.kmAtLastTest,
    structural_change: input.structuralChange,
    color_changed: input.colorChanged,
    first_registration_date: toISODate(input.firstRegistrationDate),
    has_open_recalls: input.hasOpenRecalls,
    last_synced_at: new Date().toISOString(),
  });

  if (error) {
    return { ok: false, message: `שגיאה בהוספת הרכב: ${error.message}` };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "הרכב נוסף לרשימת הרכבים שלך 🚗" };
}

// עדכון פרטי ביטוח (מוזנים ידנית ע"י המשתמש)
export async function updateInsuranceAction(
  vehicleId: string,
  expiryDate: string | null,
  cost: number | null
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "יש להתחבר", needAuth: true };

  const { error } = await supabase
    .from("vehicles")
    .update({
      insurance_expiry_date: expiryDate || null,
      insurance_cost: cost && cost > 0 ? cost : null,
    })
    .eq("id", vehicleId)
    .eq("user_id", user.id);

  if (error) return { ok: false, message: `שגיאה: ${error.message}` };

  revalidatePath(`/vehicle/${vehicleId}`);
  revalidatePath("/dashboard");
  return { ok: true, message: "פרטי הביטוח עודכנו ✓" };
}

// מרענן את נתוני הרכב מ-data.gov.il ומעדכן את הרשומה
export async function refreshVehicleAction(
  vehicleId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "יש להתחבר", needAuth: true };
  }

  // שליפת הרכב (כולל אימות בעלות)
  const { data: row } = await supabase
    .from("vehicles")
    .select("id, license_plate")
    .eq("id", vehicleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row) {
    return { ok: false, message: "הרכב לא נמצא" };
  }

  // שליפה מחדש מ-data.gov.il
  let result;
  try {
    result = await fetchVehicleByPlate(row.license_plate);
  } catch {
    return { ok: false, message: "שגיאה בחיבור למאגר הממשלתי. נסה שוב." };
  }
  if (!result) {
    return { ok: false, message: "הרכב לא נמצא במאגר הממשלתי" };
  }

  const v = result.vehicle;
  const { error } = await supabase
    .from("vehicles")
    .update({
      manufacturer: v.manufacturer,
      model: v.model,
      year: v.year || null,
      color: v.color,
      fuel_type: v.fuelType,
      owner_count: v.yad,
      last_test_date: toISODate(v.testLastDate),
      test_expiry_date: toISODate(v.testExpiryDate),
      km_at_last_test: v.kmAtLastTest || null,
      structural_change: v.structuralChange,
      color_changed: v.colorChanged,
      first_registration_date: toISODate(v.firstRegistrationDate),
      has_open_recalls: v.recalls.some((r) => r.open),
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", vehicleId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: `שגיאה בעדכון: ${error.message}` };
  }

  revalidatePath(`/vehicle/${vehicleId}`);
  revalidatePath("/dashboard");
  return { ok: true, message: "הנתונים עודכנו ממשרד התחבורה ✓" };
}
