import ChaiBuilder, { getSupabaseAdmin } from "chai-next/server";
import { get, pick } from "lodash";

export const loadSiteGlobalData = async ({ inBuilder }: { inBuilder: boolean }) => {
  const siteId = ChaiBuilder.getSiteId();
  if (!siteId) {
    return {};
  }

  const supabase = await getSupabaseAdmin();
  const siteSettings = await supabase
    .from(inBuilder ? "apps" : "apps_online")
    .select("settings")
    .eq("id", siteId)
    .single()
    .then((res) => res.data || {});

  // Load
  return {
    ...pick(get(siteSettings, `settings`, {}), [
      "siteName",
      "siteTagline",
      "logoURL",
      "email",
      "phone",
      "address",
      "socialLinks",
    ]),
  };
};
