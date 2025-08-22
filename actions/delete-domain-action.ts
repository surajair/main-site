"use server";

import { Vercel } from "@vercel/sdk";
import { getSupabaseAdmin } from "chai-next/server";
import { revalidatePath } from "next/cache";

export async function deleteDomain(hostingProjectId: string, domain: string, websiteId: string) {
  try {
    const supabaseServer = await getSupabaseAdmin();
    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });

    // Remove domain from Vercel project
    await vercel.projects.removeProjectDomain({
      idOrName: hostingProjectId,
      teamId: process.env.VERCEL_TEAM_ID!,
      domain: domain,
    });

    // Update domain entry in Supabase - set domain to empty string and domainConfigured to false
    const { error: updateError } = await supabaseServer
      .from("app_domains")
      .update({
        domain: "",
        domainConfigured: false,
      })
      .eq("app", websiteId);

    if (updateError) throw updateError;

    revalidatePath(`/websites/website/${websiteId}/details`);
    
    return {
      success: true,
      message: "Domain deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete domain error:", error);
    return {
      success: false,
      error: error?.message || "Failed to delete domain",
    };
  }
}
