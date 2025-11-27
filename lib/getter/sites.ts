"use server";

import { getSupabaseAdmin } from "chai-next/server";

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
