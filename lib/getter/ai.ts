"use server";

import { getSupabaseAdmin } from "chai-next/server";
import { sumBy } from "lodash";
import { getUser } from "./users";

export const getAiUsage = async () => {
  const supabaseServer = await getSupabaseAdmin();
  const user = await getUser();

  const { data: aiUsage } = await supabaseServer
    .from("ai_logs")
    .select("totalTokens")
    .eq("user", user.id)
    .eq("client", process.env.CHAIBUILDER_CLIENT_ID);

  return sumBy(aiUsage, "totalTokens");
};
