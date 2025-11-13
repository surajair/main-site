"use server";

import { getClientSettings } from "@/lib/getter/client";
import { getEnvironment } from "@/lib/getter/payment";
import { Paddle } from "@paddle/paddle-node-sdk";
import { getSupabaseAdmin } from "chai-next/server";
import { DodoPayments } from "dodopayments";
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY!;

// DODO cancellation function
async function cancelDodoSubscription(subscriptionId: string, isTestMode: boolean) {
  const dodo = new DodoPayments({
    bearerToken: PAYMENT_API_KEY,
    environment: isTestMode ? "test_mode" : "live_mode",
  });
  await dodo.subscriptions.update(subscriptionId, {
    cancel_at_next_billing_date: true,
  });
  return { success: true };
}

// PADDLE cancellation function
async function cancelPaddleSubscription(subscriptionId: string, isTestMode: boolean) {
  const paddle = new Paddle(PAYMENT_API_KEY, { environment: getEnvironment("PADDLE", isTestMode) });
  await paddle.subscriptions.cancel(subscriptionId, { effectiveFrom: "next_billing_period" });
  return { success: true };
}

// Main cancellation function
async function cancelSubscription(provider: string, subscriptionId: string, isTestMode: boolean) {
  switch (provider.toUpperCase()) {
    case "DODO":
      return await cancelDodoSubscription(subscriptionId, isTestMode);
    case "PADDLE":
      return await cancelPaddleSubscription(subscriptionId, isTestMode);
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}

// Server action to cancel user subscription
export async function cancelUserSubscription() {
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

    // Cancel subscription with payment provider
    const isTestMode = clientSettings?.paymentConfig?.environment === "sandbox";
    const cancellationResult = await cancelSubscription(paymentProvider, subscriptionId, isTestMode);

    if (!cancellationResult.success) {
      throw new Error("Failed to cancel subscription with payment provider");
    }

    return {
      success: true,
      message: "Subscription cancelled successfully",
    };
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to cancel subscription",
    };
  }
}
