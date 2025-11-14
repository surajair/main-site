"use server";

import { Vercel } from "@vercel/sdk";
import { domainsGetDomainConfig } from "@vercel/sdk/funcs/domainsGetDomainConfig";
import { projectsVerifyProjectDomain } from "@vercel/sdk/funcs/projectsVerifyProjectDomain";
import { getSupabaseAdmin } from "chai-next/server";
import { revalidateTag } from "next/cache";

export async function addDomain(websiteId: string, domain: string) {
  try {
    const supabase = await getSupabaseAdmin();
    domain = domain.trim().replace(/\s/g, "").replace("www.", "");
    // Check if domain already exists
    const { data: existingDomain } = await supabase.from("app_domains").select("id").eq("domain", domain).single();

    if (existingDomain) {
      throw new Error(`Domain "${domain}" already exists`);
    }

    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });

    try {
      await vercel.projects.addProjectDomain({
        idOrName: process.env.VERCEL_PROJECT_ID!,
        teamId: process.env.VERCEL_TEAM_ID!,
        requestBody: { name: domain },
      });
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes("already in use by")) {
        await supabase.from("app_domains").update({ domain: domain, domainConfigured: true }).eq("app", websiteId);
        revalidateTag(`website-settings-${websiteId}`);
        return { success: true };
      }
      if (error?.message?.toLowerCase().includes("not found")) {
        return { success: false, error: "Domain not found" };
      }
      return { success: false, error: error?.message || "Failed to add domain" };
    }

    await supabase.from("app_domains").update({ domain: domain, domainConfigured: false }).eq("app", websiteId);
    revalidateTag(`website-settings-${websiteId}`);

    return { success: true };
  } catch (error: any) {
    if (error?.message?.toLowerCase().includes("not found")) {
      return { success: false, error: "Domain not found" };
    }
    return { success: false, error: error?.message || "Failed to add domain" };
  }
}

export async function verifyDomain(domain: string) {
  try {
    const supabaseServer = await getSupabaseAdmin();
    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });
    const config = await domainsGetDomainConfig(vercel, {
      projectIdOrName: process.env.VERCEL_PROJECT_ID!,
      teamId: process.env.VERCEL_TEAM_ID!,
      domain,
    });
    if (config?.value?.misconfigured) {
      const recommendedIPv4 = config?.value?.recommendedIPv4;
      let a = "216.198.79.1";
      const result: any = await projectsVerifyProjectDomain(vercel, {
        idOrName: process.env.VERCEL_PROJECT_ID!,
        teamId: process.env.VERCEL_TEAM_ID!,
        domain,
      });
      if (recommendedIPv4?.length > 0) {
        const records = recommendedIPv4[0]?.value;
        if (records?.length > 0) {
          a = records[0];
        }
      }
      await supabaseServer.from("app_domains").update({ domainConfigured: false }).eq("domain", domain);
      throw { message: result?.error?.message || "Domain is not configured yet.", a };
    } else {
      await supabaseServer.from("app_domains").update({ domainConfigured: true }).eq("domain", domain);
    }
    return { success: true, configured: true, data: null };
  } catch (error: any) {
    const isMissingTxtRecord = error?.message?.includes("missing required TXT Record");
    if (isMissingTxtRecord || error?.a) {
      const a = error?.a || "216.198.79.1";
      const match = error.message.match(/TXT Record "([^"]+)"/);
      const txtValue = match ? match[1] : null;
      return { success: false, configured: false, error: "Domain is not configured yet", data: { txtValue, a } };
    }
    return { success: false, configured: false, error: error?.message || "Failed to verify domain", data: {} };
  }
}
