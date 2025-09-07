import { FeatureFlagProvider } from "@/lib/openfeature/feature-flag-provider";
import { fetchFeatureFlags } from "@/lib/openfeature/server";
import "chai-next/builder-styles";
import { getSupabaseAdmin } from "chai-next/server";
import Editor from "./editor";

export default async function Page({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  const supabaseServer = await getSupabaseAdmin();
  const { data } = await supabaseServer.from("app_domains").select("subdomain,domain").eq("app", websiteId).single();
  const featureFlags = await fetchFeatureFlags("admin", "free");
  return (
    <FeatureFlagProvider featureFlags={featureFlags}>
      <Editor domain={data?.subdomain} websiteId={websiteId} />
    </FeatureFlagProvider>
  );
}
