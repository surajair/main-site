"use server";

import { getSupabaseAdmin } from "chai-next/server";

export async function getWebsiteData(websiteId: string) {
  const supabaseServer = await getSupabaseAdmin();
  const { data, error }: any = await supabaseServer
    .from("apps")
    .select("data")
    .eq("id", websiteId)
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return {
    data: data?.[0]?.data,
  };
}
