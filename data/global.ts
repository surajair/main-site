import ChaiBuilder, { getSupabaseAdmin } from "chai-next/server";
import { get, pick } from "lodash";

export const loadSiteGlobalData = async ({ lang }: { lang: string }) => {
  const siteId = ChaiBuilder.getSiteId();
  if (!siteId) {
    return {};
  }
  const supabase = await getSupabaseAdmin();
  const siteSettings = await supabase
    .from("apps")
    .select("data")
    .eq("id", siteId)
    .single()
    .then((res) => res.data || {});
  console.log("siteSettings in global data provider", siteSettings);

  // Load
  return {
    ...pick(get(siteSettings, `data`, {}), [
      "siteName",
      "siteTagline",
      "logo",
      "favicon",
      "phone",
      "email",
      "address",
      "socialLinks",
    ]),
  };
};
