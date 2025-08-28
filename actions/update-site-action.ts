"use server";

import { getSupabaseAdmin } from "chai-next/server";
import { revalidatePath } from "next/cache";

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

    if (updates?.name) {
      const name = updates.name;
      const subdomain = name + "." + process.env.NEXT_PUBLIC_SUBDOMAIN;
      const { data } = await supabaseServer.from("app_domains").select("id").eq("subdomain", subdomain);
      if (data && data?.length > 0) {
        throw new Error(`The subdomain "${subdomain}" is already in use. Please try a different subdomain.`);
      }

      await supabaseServer.from("app_domains").update({ subdomain }).eq("app", siteId);
    }

    // Update the apps table
    const { data, error } = await supabaseServer.from("apps").update(updates).eq("id", siteId).select().single();

    if (error) throw error;

    // Also update the apps_online table with the same data
    const { error: onlineError } = await supabaseServer.from("apps_online").update(updates).eq("id", siteId);

    if (onlineError) throw onlineError;

    revalidatePath(`/${siteId}/details`);
    revalidatePath("/");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update site" };
  }
}
