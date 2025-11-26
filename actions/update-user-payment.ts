"use server";

import { getClientSettings } from "@/lib/getter";
import { Paddle } from "@paddle/paddle-node-sdk";
import DodoPayments from "dodopayments";
import { get, set } from "lodash";
import { updateUserPlan } from "./update-user-plan";

const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY!;

//TODO: Remove later
export const updateUserPayment = async (provider: string, paymentId: string) => {
  if (!provider || !paymentId) return { success: false, error: "Invalid provider or payment ID" };
  const clientSettings = await getClientSettings();
  const isTestMode = clientSettings?.paymentConfig?.environment === "sandbox";

  let payload: any = {};
  switch ((provider || "").toUpperCase()) {
    case "PADDLE": {
      /**
       *
       * PAYMENT REDIRECTION FROM @PADDLE
       *
       */
      const paddle = new Paddle(PAYMENT_API_KEY, { environment: (isTestMode ? "sandbox" : "production") as any });
      const transaction = await paddle.transactions.get(paymentId as string);
      const subscriptionId = transaction.subscriptionId;
      if (!subscriptionId) return { success: false, error: "No subscription found for this transaction" };
      const subscription = await paddle.subscriptions.get(subscriptionId);
      const data = get(subscription, "items[0]");
      set(data, "provider", provider);
      set(data, "client", process.env.CHAIBUILDER_CLIENT_ID);
      const nextBilledAt = get(data, "nextBilledAt");
      const planId = get(data, "product.id");
      const client = process.env.CHAIBUILDER_CLIENT_ID;
      payload = { subscriptionId, nextBilledAt, planId, client };
      break;
    }
    case "DODO": {
      /**
       *
       * PAYMENT REDIRECTION FROM @DODO
       *
       */
      const dodo = new DodoPayments({
        bearerToken: PAYMENT_API_KEY,
        environment: isTestMode ? "test_mode" : "live_mode",
      });
      const subscriptionId = paymentId as string;
      const subscription = await dodo.subscriptions.retrieve(subscriptionId);
      const data = subscription;
      set(data, "provider", provider);
      set(data, "client", process.env.CHAIBUILDER_CLIENT_ID);
      const nextBilledAt = get(data, "next_billing_date");
      const planId = get(data, "product_id");
      const client = process.env.CHAIBUILDER_CLIENT_ID;
      payload = { subscriptionId, nextBilledAt, planId, client };
      break;
    }
    default:
      return { success: false, error: "Invalid provider" };
  }

  const dataToUpdate = JSON.parse(JSON.stringify(payload));
  const success = await updateUserPlan(dataToUpdate);
  return { success, data: dataToUpdate };
};
