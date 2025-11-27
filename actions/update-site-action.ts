"use server";

import { getSupabaseAdmin } from "chai-next/server";

export async function updateSite(
  siteId: string,
  updates: {
    name?: string;
    description?: string;
    languages?: string[];
    settings?: Record<string, any>;
  },
) {
  try {
    const supabaseServer = await getSupabaseAdmin();

    // Handle website name update
    if (updates?.name && !updates.settings) {
      // If only name is being updated, merge it with existing settings and update siteName
      const { data: currentApp } = await supabaseServer.from("apps").select("settings").eq("id", siteId).single();

      updates.settings = {
        ...(currentApp?.settings && typeof currentApp.settings === "object" ? currentApp.settings : {}),
        siteName: updates.name,
      };
    }

    // Update the apps table
    const { data, error } = await supabaseServer.from("apps").update(updates).eq("id", siteId).select().single();

    if (error) throw error;

    // Also update the apps_online table with the same data
    const { error: onlineError } = await supabaseServer.from("apps_online").update(updates).eq("id", siteId);

    if (onlineError) throw onlineError;

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update site" };
  }
}

export async function updateWebsiteName(siteId: string, websiteName: string) {
  try {
    const supabaseServer = await getSupabaseAdmin();

    // Get current app data
    const { data: currentApp } = await supabaseServer.from("apps").select("settings").eq("id", siteId).single();

    const updates = {
      name: websiteName,
      settings: {
        ...(currentApp?.settings && typeof currentApp.settings === "object" ? currentApp.settings : {}),
        siteName: websiteName,
      },
    };

    // Update the apps table
    const { data, error } = await supabaseServer.from("apps").update(updates).eq("id", siteId).select().single();
    if (error) throw error;

    // Also update the apps_online table
    const { error: onlineError } = await supabaseServer.from("apps_online").update(updates).eq("id", siteId);
    if (onlineError) throw onlineError;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update website name" };
  }
}
