"use server";

import { SiteData } from "@/utils/types";
import { getSupabaseAdmin } from "chai-next/server";

export type UpdateWebsiteDataPayload = {
  id: string;
  updates: Partial<SiteData>;
};

export async function updateWebsiteData({ id, updates }: UpdateWebsiteDataPayload) {
  if (!id || !updates || Object.keys(updates).length === 0) {
    return { success: false, error: "Missing id or updates" } as const;
  }

  try {
    const supabase = await getSupabaseAdmin();

    // fetch current data
    const { data: current, error: fetchError } = await supabase
      .from("apps")
      .select("name,languages,settings")
      .eq("id", id)
      .single();
    if (fetchError || !current) throw fetchError;

    const update = { ...(current || {}), ...(updates || {}) };
    const { error: updateError } = await supabase.from("apps").update(update).eq("id", id);

    const isNameChanged = updates.name && current?.name !== updates?.name;
    const isLanguagesChanged = updates?.languages
      ? JSON.stringify(current?.languages || []) !== JSON.stringify(updates?.languages || [])
      : false;

    // * Updating Online Table if name or language changed
    if (isNameChanged || isLanguagesChanged) {
      await supabase
        .from("apps_online")
        .update(isNameChanged ? { name: updates?.name } : { languages: updates?.languages })
        .eq("id", id);
    }

    if (updateError) throw updateError;

    return { success: true, data: update } as const;
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update data" } as const;
  }
}
