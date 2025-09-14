"use server";

import { Vercel } from "@vercel/sdk";
import { getSupabaseAdmin } from "chai-next/server";

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

    // Handle website name update
    if (updates?.name && !updates.settings) {
      // If only name is being updated, merge it with existing settings and update siteName
      const { data: currentApp } = await supabaseServer.from("apps").select("settings").eq("id", siteId).single();

      updates.settings = {
        ...(currentApp?.settings && typeof currentApp.settings === "object" ? currentApp.settings : {}),
        siteName: updates.name,
      };
    }

    // Handle subdomain change (when name is passed for subdomain update)
    if (updates?.name) {
      const name = updates.name;
      const subdomain = name + "." + process.env.NEXT_PUBLIC_SUBDOMAIN;
      if (subdomain.includes("localhost")) {
        return { success: false, error: "Failed to update domain" };
      }

      // Check if the new subdomain already exists (excluding current site)
      const { data } = await supabaseServer
        .from("app_domains")
        .select("id, app")
        .eq("subdomain", subdomain)
        .neq("app", siteId);

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

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update site" };
  }
}

export async function updateWebsiteName(siteId: string, websiteName: string) {
  try {
    const supabaseServer = await getSupabaseAdmin();

    // Get current app data
    const { data: currentApp } = await supabaseServer.from("apps").select("settings").eq("id", siteId).single();

    const updates = {
      name: websiteName,
      settings: {
        ...(currentApp?.settings && typeof currentApp.settings === "object" ? currentApp.settings : {}),
        siteName: websiteName,
      },
    };

    // Update the apps table
    const { data, error } = await supabaseServer.from("apps").update(updates).eq("id", siteId).select().single();
    if (error) throw error;

    // Also update the apps_online table
    const { error: onlineError } = await supabaseServer.from("apps_online").update(updates).eq("id", siteId);
    if (onlineError) throw onlineError;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update website name" };
  }
}

export async function updateSubdomain(siteId: string, newSubdomainPrefix: string) {
  try {
    const supabaseServer = await getSupabaseAdmin();

    const subdomain = newSubdomainPrefix + "." + process.env.NEXT_PUBLIC_SUBDOMAIN;

    if (subdomain.includes("localhost")) {
      return { success: false, error: "Failed to update domain" };
    }

    // Check if the new subdomain already exists (excluding current site)
    const { data } = await supabaseServer
      .from("app_domains")
      .select("id, app")
      .eq("subdomain", subdomain)
      .neq("app", siteId);

    if (data && data?.length > 0) {
      throw new Error(`The subdomain "${subdomain}" is already in use. Please try a different subdomain.`);
    }

    const { data: appDomainData } = await supabaseServer
      .from("app_domains")
      .select("subdomain")
      .eq("app", siteId)
      .single();

    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });

    if (appDomainData?.subdomain) {
      try {
        await vercel.projects.removeProjectDomain({
          idOrName: process.env.VERCEL_PROJECT_ID!,
          teamId: process.env.VERCEL_TEAM_ID!,
          domain: appDomainData?.subdomain,
        });
      } catch (error) {}
    }

    await vercel.projects.addProjectDomain({
      idOrName: process.env.VERCEL_PROJECT_ID!,
      teamId: process.env.VERCEL_TEAM_ID!,
      requestBody: { name: subdomain },
    });

    await supabaseServer.from("app_domains").update({ subdomain }).eq("app", siteId);

    return { success: true, newSubdomain: subdomain };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update subdomain" };
  }
}
