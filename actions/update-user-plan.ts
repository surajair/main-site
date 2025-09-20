"use server";

import { getUser } from "@/lib/getter";
import { getSupabaseAdmin } from "chai-next/server";

export const updateUserPlan = async (payload: any) => {
  try {
    if (!payload) throw Error("Something went wrong");

    const supabaseServer = await getSupabaseAdmin();
    const user = await getUser();
    if (!user) return;

    const { data: existingPlans, error } = await supabaseServer.from("app_user_plans").select("*").eq("user", user.id);
    if (error) return false;

    if (existingPlans?.length > 0) {
      const { error } = await supabaseServer
        .from("app_user_plans")
        .update({ ...payload })
        .eq("user", user.id);
      if (error) return false;
    } else {
      const { error } = await supabaseServer.from("app_user_plans").insert({ user: user.id, ...payload });
      if (error) return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
