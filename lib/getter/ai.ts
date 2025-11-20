"use server";

import { getSupabaseAdmin } from "chai-next/server";
import { sumBy } from "lodash";
import { getUser } from "./users";

export const getAiUsage = async () => {
  const supabaseServer = await getSupabaseAdmin();
  const user = await getUser();

  const { data: aiUsage, error } = await supabaseServer
    .from("ai_logs")
    .select("totalTokens")
    .eq("user", user.id)
    .eq("client", process.env.CHAIBUILDER_CLIENT_ID);

  if (error) {
    console.error("Error fetching AI usage:", error);
    return 0;
  }

  return sumBy(aiUsage, "totalTokens");
};
