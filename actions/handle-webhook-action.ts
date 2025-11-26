"use server";

import { cancelUserPlan } from "./cancel-user-plan";
import { updateUserPlan } from "./update-user-plan";

export const handleDodoWebhookAction = async (eventType: string, payload: any) => {
  const startTime = Date.now();
  const actionId = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`[${actionId}] 🎯 handleDodoWebhookAction started`);
    console.log(`[${actionId}] 📊 Input parameters:`, {
      eventType,
      hasPayload: !!payload,
      payloadKeys: payload ? Object.keys(payload) : [],
    });

    if (!eventType || !payload) {
      console.error(`[${actionId}] ❌ Missing required parameters:`, {
        hasEventType: !!eventType,
        hasPayload: !!payload,
      });
      return { success: false, error: "Missing event type or payload" };
    }

    // Extract subscription ID from payload
    const subscriptionId = payload?.data?.subscription_id;
    console.log(`[${actionId}] 🔍 Extracting subscription ID:`, {
      subscriptionId,
      hasData: !!payload?.data,
      dataKeys: payload?.data ? Object.keys(payload.data) : [],
    });

    if (!subscriptionId) {
      console.error(`[${actionId}] ❌ Missing subscription ID in payload`);
      return { success: false, error: "Missing subscription ID" };
    }

    console.log(`[${actionId}] 🔄 Processing event type: ${eventType}`);

    switch (eventType) {
      case "subscription.active":
      case "subscription.renewed": {
        console.log(`[${actionId}] 📈 Processing ${eventType} event`);
        const userPlan = {
          subscriptionId,
          nextBilledAt: payload?.data?.next_billing_date,
          planId: payload?.data?.product_id,
          provider: "DODO",
        };
        console.log(`[${actionId}] 📋 User plan data:`, {
          ...userPlan,
          subscriptionId: userPlan.subscriptionId,
          nextBilledAt: userPlan.nextBilledAt,
          planId: userPlan.planId,
        });

        const updateStartTime = Date.now();
        const result = await updateUserPlan(userPlan);
        const updateDuration = Date.now() - updateStartTime;

        console.log(`[${actionId}] ✅ updateUserPlan completed in ${updateDuration}ms:`, result);
        return result;
      }

      case "subscription.cancelled": {
        console.log(`[${actionId}] 🚫 Processing subscription.cancelled event`);
        const cancelStartTime = Date.now();
        const result = await cancelUserPlan(subscriptionId);
        const cancelDuration = Date.now() - cancelStartTime;

        console.log(`[${actionId}] ✅ cancelUserPlan completed in ${cancelDuration}ms:`, result);
        return result;
      }

      case "subscription.expired": {
        console.log(`[${actionId}] ⏰ Processing subscription.expired event`);
        const expireStartTime = Date.now();
        const result = await cancelUserPlan(subscriptionId);
        const expireDuration = Date.now() - expireStartTime;

        console.log(`[${actionId}] ✅ cancelUserPlan (for expired) completed in ${expireDuration}ms:`, result);
        return result;
      }

      default: {
        console.log(`[${actionId}] ⚠️ Unhandled Dodo webhook event type: ${eventType}`);
        console.log(`[${actionId}] 📝 Event logged but not processed. Payload:`, {
          eventType,
          hasData: !!payload?.data,
          subscriptionId,
        });
        return { success: true, message: `Event type ${eventType} logged but not processed` };
      }
    }
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${actionId}] 💥 Error in handleDodoWebhookAction after ${totalDuration}ms:`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
      eventType,
      subscriptionId: payload?.data?.subscription_id,
    });
    return { success: false, error: error.message || "Failed to process webhook event" };
  } finally {
    const totalDuration = Date.now() - startTime;
    console.log(`[${actionId}] ⏱️ handleDodoWebhookAction completed in ${totalDuration}ms`);
  }
};

//TODO: Add more providers here as needed
