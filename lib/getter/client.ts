"use server";

import { getSupabaseAdmin } from "chai-next/server";
import { cache } from "react";

export type ClientSettings = {
  logo: string;
  favicon: string;
  name: string;
  feedbackSubmissions: string;
  loginProviders: string[];
  loginHtml: string;
  features: Record<string, any>;
} & Record<string, any>;

export const getClientSettings = cache(async (): Promise<ClientSettings> => {
  const supabaseServer = await getSupabaseAdmin();
  const { data, error } = await supabaseServer
    .from("clients")
    .select("settings, loginHtml, features")
    .eq("id", process.env.CHAIBUILDER_CLIENT_ID)
    .single();
  if (error) throw error;
  return {
    loginHtml: data.loginHtml,
    ...(data?.settings || {}),
    name: data?.settings?.name || "Your Builder",
    logo: data?.settings?.logo || "https://placehold.co/52x52",
    favicon: data?.settings?.favicon || "https://placehold.co/52x52",
    feedbackSubmissions: data?.settings?.feedbackSubmissions || "",
    loginProviders: data?.settings?.loginProviders || [],
    features: data?.features || {},
  };
});
