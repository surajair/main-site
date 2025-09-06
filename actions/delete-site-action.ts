"use server";

import { getSession } from "@/lib/getter/users";
import { Vercel } from "@vercel/sdk";
import { getSupabaseAdmin } from "chai-next/server";

const noIsNotFound = (error: any) => {
  return error && !error.message.includes("not found");
};

export async function deleteSite(siteId: string) {
  const supabaseServer = await getSupabaseAdmin();

  // Get current user's session
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const { data: appData } = await supabaseServer
    .from("app_domains")
    .select("domain, subdomain")
    .eq("app", siteId)
    .single();

  const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });

  if (appData?.domain) {
    await vercel.projects.removeProjectDomain({
      idOrName: process.env.VERCEL_PROJECT_ID!,
      teamId: process.env.VERCEL_TEAM_ID!,
      domain: appData.domain,
    });
  }

  if (appData?.subdomain) {
    await vercel.projects.removeProjectDomain({
      idOrName: process.env.VERCEL_PROJECT_ID!,
      teamId: process.env.VERCEL_TEAM_ID!,
      domain: appData.subdomain,
    });
  }

  await supabaseServer.from("app_domains").delete().eq("app", siteId);

  // Mark as deleted by setting deletedAt
  const { error } = await supabaseServer
    .from("apps")
    .update({ deletedAt: new Date().toISOString() })
    .eq("id", siteId)
    .eq("user", session?.user?.id);

  if (noIsNotFound(error)) {
    throw error;
  }

  return true;
}
