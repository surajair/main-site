import { getSupabaseAdmin } from "chai-next/server";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList?.get("host");

  if (!host) return [];
  const trimmedHost = host.replace("www.", "");
  const supabase = await getSupabaseAdmin();

  const { data: app, error: domainError } = await supabase
    .from("app_domains")
    .select("app")
    .or(`domain.eq.${trimmedHost},subdomain.eq.${trimmedHost}`)
    .single();

  if (!app || !app.app || domainError) return [];

  const { data: pages } = await supabase
    .from("app_pages_online")
    .select("slug,lang,lastSaved")
    .eq("app", app.app)
    .neq("slug", "");

  return (
    pages?.map((page) => {
      const item: any = { url: `https://${host}${page.slug}` };
      if (page.lastSaved) item.lastModified = new Date(page.lastSaved);
      return item;
    }) || []
  );
}
