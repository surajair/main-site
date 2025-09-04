import "chai-next/builder-styles";
import { getSupabaseAdmin } from "chai-next/server";
import Editor from "./editor";

export default async function Page({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  const supabaseServer = await getSupabaseAdmin();
  const { data } = await supabaseServer.from("app_domains").select("subdomain,domain").eq("app", websiteId).single();

  return <Editor domain={data?.subdomain} websiteId={websiteId} />;
}
