"use server";

import { getUser } from "@/lib/getter";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { getSupabaseAdmin } from "chai-next/server";
import { get } from "lodash";

export const getAndUpdateSubscriptionDetails = async (transactionId: string) => {
  if (!transactionId) {
    return { success: false, error: "Transaction ID required" };
  }

  const paddle = new Paddle(process.env.PAYMENT_API_KEY!, {
    environment: process.env.NODE_ENV === "development" ? Environment.sandbox : Environment.production,
  });

  try {
    const transaction = await paddle.transactions.get(transactionId);
    const subscriptionId = transaction.subscriptionId;

    if (!subscriptionId) {
      return { success: false, error: "No subscription found for this transaction" };
    }

    const subscription = await paddle.subscriptions.get(subscriptionId);
    const data = get(subscription, "items[0]");
    const nextBilledAt = get(data, "nextBilledAt");
    const planId = get(data, "product.id");
    const priceId = get(data, "price.id");
    const status = get(data, "status");
    await updateUserPlan({ subscriptionId, nextBilledAt, data, planId, priceId, status });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
};

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
