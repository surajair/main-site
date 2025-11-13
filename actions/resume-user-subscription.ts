"use server";

import { getClientSettings } from "@/lib/getter/client";
import { Paddle } from "@paddle/paddle-node-sdk";
import { getSupabaseAdmin } from "chai-next/server";
import { DodoPayments } from "dodopayments";

const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY!;

// DODO resume subscription function
async function resumeDodoSubscription(subscriptionId: string, isTestMode: boolean) {
  const dodo = new DodoPayments({
    bearerToken: PAYMENT_API_KEY,
    environment: isTestMode ? "test_mode" : "live_mode",
  });
  await dodo.subscriptions.update(subscriptionId, {
    cancel_at_next_billing_date: false,
  });
  return { success: true };
}

// PADDLE resume subscription function
async function resumePaddleSubscription(subscriptionId: string, isTestMode: boolean) {
  const env = isTestMode ? "sandbox" : "production";
  const paddle = new Paddle(PAYMENT_API_KEY, { environment: env as any });
  await paddle.subscriptions.update(subscriptionId, {
    scheduledChange: { action: "resume", effectiveAt: new Date().toISOString() },
  });
  return { success: true };
}

// Main resume function
async function resumeSubscription(provider: string, subscriptionId: string, isTestMode: boolean) {
  switch (provider.toUpperCase()) {
    case "DODO":
      return await resumeDodoSubscription(subscriptionId, isTestMode);
    case "PADDLE":
      return await resumePaddleSubscription(subscriptionId, isTestMode);
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}

// Server action to resume user subscription
export async function resumeUserSubscription() {
  try {
    const supabaseServer = await getSupabaseAdmin();
    const clientSettings = await getClientSettings();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabaseServer.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Get user's current subscription
    const { data: userPlan, error: planError } = await supabaseServer
      .from("app_user_plans")
      .select("*")
      .eq("user", user.id)
      .eq("client", clientSettings?.id)
      .single();

    if (planError || !userPlan) {
      throw new Error("No active subscription found");
    }

    const paymentProvider = clientSettings?.paymentConfig?.provider;
    if (!paymentProvider) {
      throw new Error("Payment provider not configured");
    }

    // Extract subscription ID from user plan data
    const subscriptionId = userPlan.subscriptionId;
    if (!subscriptionId) {
      throw new Error("Subscription ID not found");
    }

    // Resume subscription with payment provider
    const isTestMode = clientSettings?.paymentConfig?.environment === "sandbox";
    const resumeResult = await resumeSubscription(paymentProvider, subscriptionId, isTestMode);

    if (!resumeResult.success) {
      throw new Error("Failed to resume subscription with payment provider");
    }

    // Update user plan in database to remove scheduled cancellation
    const { error: updateError } = await supabaseServer
      .from("app_user_plans")
      .update({ scheduledForCancellation: false })
      .eq("user", user.id)
      .eq("clientId", clientSettings?.id);

    if (updateError) {
      throw new Error("Failed to update subscription status in database");
    }

    return {
      success: true,
      message: "Your subscription has been successfully resumed.",
    };
  } catch (error) {
    console.error("Subscription resume error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to resume subscription",
    };
  }
}
