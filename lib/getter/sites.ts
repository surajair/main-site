"use server";

import { getSupabaseAdmin } from "chai-next/server";

export interface Site {
  id: string;
  name: string;
  createdAt: string;
  fallbackLang: string;
  languages: string[];
  apiKey: string;
  domain?: string;
  subdomain?: string;
  hosting?: string;
  domainConfigured: boolean;
}

export interface SiteWithApiKeys extends Site {
  app_api_keys: Array<{ apiKey: string }>;
}

export interface WebsiteData {
  data: any;
}

/**
 * Get all sites for a user
 * @param userId - The user ID
 * @param sitesWithDomainOnly - Whether to filter sites with domains only
 * @returns Array of sites
 */
export async function getSites(userId: string, sitesWithDomainOnly = false): Promise<Site[]> {
  const supabaseServer = await getSupabaseAdmin();
  const { data, error } = await supabaseServer
    .from("apps")
    .select(
      `
      id,
      name,
      createdAt,
      fallbackLang,
      languages,
      app_api_keys (
        apiKey
      ),
      app_domains (
        domain,
        subdomain,
        hosting,
        domainConfigured
      )
    `,
    )
    .eq("user", userId)
    .is("deletedAt", null)
    .order("createdAt", { ascending: false });

  if (error) throw error;

  // Transform the data to flatten app_domains and apiKey into Site objects
  return data
    ?.map((site: any) => {
      const domainData = site.app_domains?.[0] || {};
      const apiKeyData = site.app_api_keys?.[0] || {};

      return {
        id: site.id,
        name: site.name,
        createdAt: site.createdAt,
        fallbackLang: site.fallbackLang,
        languages: site.languages,
        apiKey: apiKeyData.apiKey || "",
        domain: domainData.domain || undefined,
        subdomain: domainData.subdomain || undefined,
        hosting: domainData.hosting || undefined,
        domainConfigured: domainData.domainConfigured || false,
      };
    })
    .filter((site: Site) => (sitesWithDomainOnly ? site.subdomain : !site.subdomain)) || [];
}

/**
 * Get a specific site for a user
 * @param userId - The user ID
 * @param websiteId - The website ID
 * @returns Site object
 */
export async function getSite(userId: string, websiteId: string): Promise<SiteWithApiKeys> {
  const supabaseServer = await getSupabaseAdmin();
  const { data, error }: any = await supabaseServer
    .from("apps")
    .select(
      `
      id,
      name,
      createdAt,
      fallbackLang,
      languages,
      app_api_keys (
        apiKey
      ),
      app_domains (
        domain,
        subdomain,
        hosting,
        domainConfigured
      )
    `,
    )
    .eq("user", userId)
    .is("deletedAt", null)
    .eq("id", websiteId)
    .order("createdAt", { ascending: false })
    .single();

  if (error) throw error;

  // Transform the data to flatten app_domains and apiKey into Site object
  const domainData = data.app_domains?.[0] || {};
  const apiKeyData = data.app_api_keys?.[0] || {};

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    fallbackLang: data.fallbackLang,
    languages: data.languages,
    apiKey: apiKeyData.apiKey || "",
    app_api_keys: data.app_api_keys || [],
    domain: domainData.domain || undefined,
    subdomain: domainData.subdomain || undefined,
    hosting: domainData.hosting || undefined,
    domainConfigured: domainData.domainConfigured || false,
  };
}

/**
 * Get website data for a specific website
 * @param websiteId - The website ID
 * @returns Website data object
 */
export async function getSiteData(websiteId: string): Promise<WebsiteData> {
  const supabaseServer = await getSupabaseAdmin();
  const { data: websiteData, error }: any = await supabaseServer
    .from("apps")
    .select("data")
    .eq("id", websiteId)
    .order("createdAt", { ascending: false })
    .single();

  if (error) throw error;
  
  return {
    data: websiteData?.data,
  };
}
