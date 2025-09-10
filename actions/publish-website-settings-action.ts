import { getSupabaseAdmin } from "chai-next/server";

export async function publishWebsiteSettings(id: string) {
  try {
    const supabase = await getSupabaseAdmin();

    // fetch current data
    const { data: current, error: fetchError } = await supabase.from("apps").select("settings").eq("id", id).single();

    if (fetchError) throw fetchError;

    // update apps_online > settings
    const { error: updateError } = await supabase
      .from("apps_online")
      .update({ settings: current.settings })
      .eq("id", id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to publish website settings" };
  }
}
