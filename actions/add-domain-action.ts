"use server";

import { Vercel } from "@vercel/sdk";
import { projectsVerifyProjectDomain } from "@vercel/sdk/funcs/projectsVerifyProjectDomain";
import { getSupabaseAdmin } from "chai-next/server";

export async function addDomain(websiteId: string, domain: string) {
  try {
    const supabase = await getSupabaseAdmin();
    // Check if domain already exists
    const { data: existingDomain } = await supabase.from("app_domains").select("id").eq("domain", domain).single();

    if (existingDomain) {
      throw new Error(`Domain "${domain}" already exists`);
    }

    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });

    await vercel.projects.addProjectDomain({
      idOrName: process.env.VERCEL_PROJECT_ID!,
      teamId: process.env.VERCEL_TEAM_ID!,
      requestBody: { name: domain },
    });

    await supabase.from("app_domains").update({ domain: domain, domainConfigured: false }).eq("app", websiteId);

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
    const result: any = await projectsVerifyProjectDomain(vercel, {
      idOrName: process.env.VERCEL_PROJECT_ID!,
      teamId: process.env.VERCEL_TEAM_ID!,
      domain,
    });
    const isVerified = result.ok && result.value;
    await supabaseServer.from("app_domains").update({ domainConfigured: isVerified }).eq("domain", domain);
    if (!isVerified) throw result.error?.message;
    return { success: true, configured: true, data: null };
  } catch (error: any) {
    const isMissingTxtRecord = error?.includes("missing required TXT Record");
    if (isMissingTxtRecord) {
      const match = error.match(/TXT Record "([^"]+)"/);
      const txtValue = match ? match[1] : null;
      const a = "216.198.79.1";
      return { success: false, configured: false, error: "Domain is not configured yet", data: { txtValue, a } };
    }
    return { success: false, configured: false, error: error?.message || "Failed to verify domain", data: {} };
  }
}
