"use server";

import { cancelUserPlan } from "./cancel-user-plan";
import { updateUserPlan } from "./update-user-plan";

export const handleDodoWebhookAction = async (eventType: string, payload: any, userId: string) => {
  try {
    if (!eventType || !payload) {
      return { success: false, error: "Missing event type or payload" };
    }

    // Extract subscription ID from payload
    const subscriptionId = payload?.data?.subscription_id;
    if (!subscriptionId) {
      return { success: false, error: "Missing subscription ID" };
    }

    switch (eventType) {
      case "subscription.active":
      case "subscription.renewed": {
        const userPlan = {
          subscriptionId,
          nextBilledAt: payload?.data?.next_billing_date,
          planId: payload?.data?.product_id,
          user: userId,
        };

        const result = await updateUserPlan(userPlan);
        return result;
      }

      case "subscription.cancelled": {
        const result = await cancelUserPlan(subscriptionId);
        return result;
      }

      case "subscription.expired": {
        const result = await cancelUserPlan(subscriptionId);
        return result;
      }

      default: {
        console.log(`Unhandled Dodo webhook event type: ${eventType}`);
        return { success: true, message: `Event type ${eventType} logged but not processed` };
      }
    }
  } catch (error: any) {
    console.error("Error handling Dodo webhook:", error);
    return { success: false, error: error.message || "Failed to process webhook event" };
  }
};

//TODO: Add more providers here as needed
