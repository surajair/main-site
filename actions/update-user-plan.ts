"use server";

import { getUser } from "@/lib/getter";
import { getSupabaseAdmin } from "chai-next/server";
import { get } from "lodash";

function getRenewDate(data: any) {
  const billingCycle = get(data, "items[0].billing_cycle.interval", "month") === "month" ? "monthly" : "yearly";
  const now = new Date();
  const nextRenewDate = new Date(now);
  nextRenewDate.setUTCHours(0, 0, 0, 0);

  if (billingCycle === "monthly") {
    nextRenewDate.setUTCMonth(nextRenewDate.getUTCMonth() + 1);
  } else {
    nextRenewDate.setUTCFullYear(nextRenewDate.getUTCFullYear() + 1);
  }

  return nextRenewDate.toISOString();
}

export const updateUserPlan = async (data: any) => {
  try {
    const supabaseServer = await getSupabaseAdmin();
    const user = await getUser();
    if (!user) return;

    const { data: existingPlans, error } = await supabaseServer.from("app_user_plans").select("*").eq("user", user.id);

    if (error) return false;

    if (existingPlans?.length > 0) {
      const { error } = await supabaseServer
        .from("app_user_plans")
        .update({ data, renewAt: getRenewDate(data) })
        .eq("user", user.id);
      if (error) return false;
    } else {
      const payload = {
        user: user.id,
        status: "ACTIVE",
        renewAt: getRenewDate(data),
        plan: get(data, "items[0].price_id", "FREE"),
        data,
      };
      const { error } = await supabaseServer.from("app_user_plans").insert(payload);
      if (error) return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
