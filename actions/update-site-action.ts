"use server";

import { Vercel } from "@vercel/sdk";
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
      if (subdomain.includes("localhost")) {
        return { success: false, error: "Failed to update domain" };
      }
      const { data } = await supabaseServer.from("app_domains").select("id").eq("subdomain", subdomain);
      if (data && data?.length > 0) {
        throw new Error(`The subdomain "${subdomain}" is already in use. Please try a different subdomain.`);
      }

      const { data: appDomainData } = await supabaseServer
        .from("app_domains")
        .select("subdomain")
        .eq("app", siteId)
        .single();

      if (appDomainData?.subdomain) {
        const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });
        await vercel.projects.removeProjectDomain({
          idOrName: process.env.VERCEL_PROJECT_ID!,
          teamId: process.env.VERCEL_TEAM_ID!,
          domain: appDomainData?.subdomain,
        });
      }

      const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });
      await vercel.projects.addProjectDomain({
        idOrName: process.env.VERCEL_PROJECT_ID!,
        teamId: process.env.VERCEL_TEAM_ID!,
        requestBody: { name: subdomain },
      });

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
