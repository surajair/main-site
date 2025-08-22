"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { Site } from "@/utils/types";
import { revalidatePath } from "next/cache";
import { encodedApiKey } from "@/utils/api-key";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

export async function revokeApiKey(site: Site) {
  try {
    // Generate new API key
    const newApiKey = encodedApiKey(site.id, ENCRYPTION_KEY);

    // Update the API key in app_api_keys table
    const { data, error } = await supabaseServer
      .from("app_api_keys")
      .update({ apiKey: newApiKey })
      .eq("app", site.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/sites");
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to revoke API key",
    };
  }
}
