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
  data: any;
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
  const { data, error } = await supabaseServer
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
    .is("deletedAt", null)
    .order("createdAt", { ascending: false });

  if (error) throw error;

  return data
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
      data,
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
    data: data.data,
    languages: data.languages,
    fallbackLang: data.fallbackLang,
    domainConfigured: data.app_domains?.[0]?.domainConfigured,
    domain: data.app_domains?.[0]?.domain,
    subdomain: data.app_domains?.[0]?.subdomain,
    hosting: data.app_domains?.[0]?.hosting,
  };
}
