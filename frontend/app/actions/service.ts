"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addServiceRecordAction(
  vehicleId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = (formData.get("title") as string)?.trim();
  const serviceType = formData.get("service_type") as string;
  const serviceDate = formData.get("service_date") as string;

  if (!title || !serviceType || !serviceDate) {
    redirect(`/vehicle/${vehicleId}?error=missing_fields`);
  }

  // ודא שהרכב שייך למשתמש לפני שמוסיפים טיפול (defense-in-depth מעבר ל-RLS)
  const { data: ownedVehicle } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", vehicleId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!ownedVehicle) {
    redirect(`/vehicle/${vehicleId}?error=not_authorized`);
  }

  const cost = parseInt(formData.get("cost") as string) || 0;
  const kmAtService = parseInt(formData.get("km_at_service") as string) || 0;
  const garageName = (formData.get("garage_name") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  const { error } = await supabase.from("service_records").insert({
    vehicle_id: vehicleId,
    user_id: user.id,
    service_type: serviceType,
    title,
    description,
    garage_name: garageName,
    cost,
    km_at_service: kmAtService,
    service_date: serviceDate,
  });

  if (error) {
    redirect(`/vehicle/${vehicleId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/vehicle/${vehicleId}`);
  redirect(`/vehicle/${vehicleId}`);
}
