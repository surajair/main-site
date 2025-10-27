"use server";

import { getSupabaseAdmin } from "chai-next/server";
import { getUser } from "./users";

export type Sites = {
  id: string;
  name: string;
  createdAt: string;
  domain: string;
  subdomain: string;
  hosting: string;
  domainConfigured: boolean;
  displayDomain: string;
};
export interface Site {
  id: string;
  name: string;
  createdAt: string;
  fallbackLang?: string;
  languages?: string[];
  apiKey?: string;
  domain?: string;
  subdomain?: string;
  hosting?: string;
  domainConfigured: boolean;
  settings: any;
}

/**
 * Get all sites for a user
 * @param userId - The user ID
 * @param sitesWithDomainOnly - Whether to filter sites with domains only
 * @returns Array of sites
 */
export async function getSites(): Promise<Sites[]> {
  const supabaseServer = await getSupabaseAdmin();
  const user = await getUser();

  // Get apps where user is the owner
  const { data: ownedApps, error: ownedError } = await supabaseServer
    .from("apps")
    .select(
      `
      id,
      name,
      createdAt,
      app_domains (
        domain,
        subdomain,
        hosting,
        domainConfigured
      )
    `,
    )
    .eq("user", user.id)
    .eq("client", process.env.CHAIBUILDER_CLIENT_ID)
    .is("deletedAt", null);

  if (ownedError) throw ownedError;

  // Get apps where user is a member
  const { data: memberApps, error: memberError } = await supabaseServer
    .from("app_users")
    .select(
      `
      apps!inner (
        id,
        name,
        createdAt,
        app_domains (
          domain,
          subdomain,
          hosting,
          domainConfigured
        )
      )
    `,
    )
    .eq("user", user.id)
    .eq("apps.client", process.env.CHAIBUILDER_CLIENT_ID)
    .is("apps.deletedAt", null);

  if (memberError) throw memberError;

  // Combine and deduplicate apps
  const allAppsMap = new Map();

  ownedApps?.forEach((app) => {
    allAppsMap.set(app.id, app);
  });

  memberApps?.forEach((item: any) => {
    if (item.apps && !allAppsMap.has(item.apps.id)) {
      allAppsMap.set(item.apps.id, item.apps);
    }
  });

  const allApps = Array.from(allAppsMap.values());

  // Sort by createdAt descending
  allApps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return allApps
    .filter((site) => site?.app_domains?.length > 0)
    ?.map((site) => {
      return {
        id: site.id,
        name: site.name,
        createdAt: site.createdAt,
        domain: site.app_domains[0].domain,
        subdomain: site.app_domains[0].subdomain,
        hosting: site.app_domains[0].hosting,
        domainConfigured: site.app_domains[0].domainConfigured,
        displayDomain:
          site.app_domains[0].domain && site.app_domains[0].domainConfigured
            ? site.app_domains[0].domain
            : site.app_domains[0].subdomain,
      };
    });
}

/**
 * Get a specific site for a user
 * @param websiteId - The website ID
 * @returns Site object
 */
export async function getSite(websiteId: string): Promise<Site> {
  const supabaseServer = await getSupabaseAdmin();
  const { data, error }: any = await supabaseServer
    .from("apps")
    .select(
      `
      id,
      name,
      createdAt,
      settings,
      languages,
      fallbackLang,
      app_domains (
        domain,
        subdomain,
        hosting,
        domainConfigured
      )
    `,
    )
    .is("deletedAt", null)
    .eq("id", websiteId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    settings: data.settings,
    languages: data.languages,
    fallbackLang: data.fallbackLang,
    domainConfigured: data.app_domains?.[0]?.domainConfigured,
    domain: data.app_domains?.[0]?.domain,
    subdomain: data.app_domains?.[0]?.subdomain,
    hosting: data.app_domains?.[0]?.hosting,
  };
}

export async function getDomainsCount(websiteIds: string[]): Promise<number> {
  const supabaseServer = await getSupabaseAdmin();
  const { data, error }: any = await supabaseServer.from("app_domains").select("domain").in("app", websiteIds);

  if (error) throw error;

  return data?.filter((domain: any) => domain?.domain)?.length;
}
