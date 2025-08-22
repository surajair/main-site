"use server";

import { Site } from "@/utils/types";
import { Vercel } from "@vercel/sdk";
import { getSupabaseAdmin } from "chai-next/server";
import { revalidatePath } from "next/cache";

export async function addDomain(site: Site, domain: string) {
  try {
    const supabase = await getSupabaseAdmin()
    // Check if domain already exists
    const { data: existingDomain } = await supabase
      .from("app_domains")
      .select("id")
      .eq("domain", domain)
      .single();

    if (existingDomain) {
      throw new Error(`Domain "${domain}" already exists`);
    }

    if (!site.hostingProjectId) {
      throw new Error(`No hosting project found for website ${site.name}`);
    }

    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });

    await vercel.projects.addProjectDomain({
      idOrName: site.hostingProjectId,
      teamId: process.env.VERCEL_TEAM_ID!,
      requestBody: {
        name: domain,
      },
    });

    const checkConfiguration = await vercel.domains.getDomainConfig({
      teamId: process.env.VERCEL_TEAM_ID!,
      domain: domain,
    });

    const { error } = await supabase
      .from("app_domains")
      .update({
        domain: domain,
        domainConfigured: !!checkConfiguration.configuredBy && !checkConfiguration.misconfigured,
      })
      .eq("app", site.id);

    if (error) throw error;

    revalidatePath(`/websites/website/${site.id}/details`);
    return {
      success: true,
      data: checkConfiguration,
      configured: !!checkConfiguration.configuredBy,
      needsConfiguration: !checkConfiguration.configuredBy,
    };
  } catch (error: any) {
    if (error?.message?.toLowerCase().includes("not found")) {
      return {
        success: false,
        error: "Domain not found",
      };
    }
    return {
      success: false,
      error: error?.message || "Failed to add domain",
    };
  }
}

export async function verifyDomain(domain: string) {
  try {
    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });

    const checkConfiguration = await vercel.domains.getDomainConfig({
      teamId: process.env.VERCEL_TEAM_ID!,
      domain: domain,
    });

    const isConfigured = !!checkConfiguration.configuredBy && !checkConfiguration.misconfigured;

    const { error } = await supabaseServer
      .from("app_domains")
      .update({ domainConfigured: isConfigured })
      .eq("domain", domain);

    if (error) throw error;

    return {
      success: true,
      configured: !!checkConfiguration.configuredBy,
      data: checkConfiguration,
      needsConfiguration: !checkConfiguration.configuredBy,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to verify domain configuration",
    };
  }
}
