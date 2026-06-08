"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  if (!name) redirect("/settings?error=שם+לא+יכול+להיות+ריק");

  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  redirect("/settings?success=1");
}

// שדרוג ל-Premium — מיידי וללא תשלום אמיתי (דמו).
// מציג כאילו זהו מנוי בתשלום, אך בפועל פשוט הופך את התוכנית ל-premium.
export async function upgradeToPremiumAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ plan: "premium" })
    .eq("id", user.id);

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  // פתיחת כל הפיצ'רים תלויי-תוכנית
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/favorites");
  revalidatePath("/history");
  redirect("/settings?upgraded=1");
}
