"use server";

import { getUser } from "@/lib/getter";
import { getSupabaseAdmin } from "chai-next/server";

export const updateUserPlan = async (payload: any) => {
  try {
    if (!payload) return false;

    const supabaseServer = await getSupabaseAdmin();
    const user = await getUser();
    if (!user) return false;

    const updatedPayload = { ...payload, user: user.id, client: process.env.CHAIBUILDER_CLIENT_ID };

    /**
     * Check if user already has a plan
     */
    const { data: existingPlans, error: existingPlansError } = await supabaseServer
      .from("app_user_plans")
      .select("*")
      .eq("user", user.id)
      .eq("client", process.env.CHAIBUILDER_CLIENT_ID);
    if (existingPlansError) return false;

    /**
     * Update plan if user already has a plan
     */
    if (existingPlans?.length > 0) {
      const { error: updateError } = await supabaseServer
        .from("app_user_plans")
        .update(updatedPayload)
        .eq("user", user.id)
        .eq("client", process.env.CHAIBUILDER_CLIENT_ID);
      if (updateError) return false;
      return true;
    }

    /**
     * Insert plan if user does not have a plan
     */
    const { error: insertError } = await supabaseServer.from("app_user_plans").insert(updatedPayload);
    if (insertError) return false;
    return true;
  } catch (error) {
    return false;
  }
};
