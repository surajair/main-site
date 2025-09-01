"use server";

import { getSupabaseAdmin } from "chai-next/server";

export async function getWebsiteData(websiteId: string) {
  const supabaseServer = await getSupabaseAdmin();
  const { data: websiteData, error }: any = await supabaseServer
    .from("apps")
    .select("data")
    .eq("id", websiteId)
    .order("createdAt", { ascending: false })
    .single();

  if (error) throw error;
  console.log("Website data retrieved:", websiteData);
  return {
    data: websiteData?.data,
  };
}
