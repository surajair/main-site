"use server";

import { getSupabaseAdmin } from "chai-next/server";

type AllowedField =
  | "siteName"
  | "siteTagline"
  | "language"
  | "timezone"
  | "logoURL"
  | "faviconURL"
  | "email"
  | "phone"
  | "address"
  | "socialLinks"
  | "googleAnalyticsId"
  | "googleTagManagerId"
  | "metaPixelId"
  | "customTrackingScripts"
  | "cookieConsentEnabled"
  | "privacyPolicyURL"
  | "termsURL"
  | "recaptchaSiteKey"
  | "recaptchaSecretKey";

// ✅ Payload for updating multiple fields at once
export type UpdateWebsiteDataPayload = {
  id: string;
  updates: Partial<Record<AllowedField, any>>;
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
      .select("data")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // merge updates into the JSON data column
    const currentData = (current?.data ?? {}) as Record<string, any>;
    const nextData = { ...currentData, ...updates };

    // update apps > data
    const { error: updateError } = await supabase
      .from("apps")
      .update({ data: nextData })
      .eq("id", id);

    if (updateError) throw updateError;

    return { success: true , data: nextData } as const;
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update data" } as const;
  }
}
