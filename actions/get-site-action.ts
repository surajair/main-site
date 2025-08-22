"use server";

import { getSupabaseAdmin } from "chai-next/server";


export async function getSite(userId: string, websiteId: string) {
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
        domainConfigured,
        hostingProjectId
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
    apiKey: apiKeyData.apiKey || '',
    app_api_keys: data.app_api_keys || [],
    domain: domainData.domain || undefined,
    subdomain: domainData.subdomain || undefined,
    hostingProjectId: domainData.hostingProjectId || undefined,
    hosting: domainData.hosting || undefined,
    domainConfigured: domainData.domainConfigured || false,
  };
}
