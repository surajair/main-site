"use server";

import { getUser } from "@/lib/getter";
import { getSupabaseAdmin } from "chai-next/server";
import { get } from "lodash";
import { headers } from "next/headers";

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
    const headersList = await headers();
    const host = headersList?.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;
    const transactionId = get(data, "transaction_id");
    const response = await fetch(`${origin}/api/subscription-details?transactionId=${encodeURIComponent(transactionId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const payload = await response.json();
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
