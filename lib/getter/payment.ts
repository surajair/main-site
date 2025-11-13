"use server";

import { Paddle } from "@paddle/paddle-node-sdk";
import DodoPayments from "dodopayments";
import { forEach, get, omit } from "lodash";

const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY!;

export const getEnvironment = (provider: "PADDLE" | "DODO", isTestMode: boolean): any => {
  switch (provider) {
    case "PADDLE":
      return isTestMode ? "sandbox" : "production";
    case "DODO":
      return isTestMode ? "test_mode" : "live_mode";
  }
};

export const getProductList = async (provider: "PADDLE" | "DODO", isTestMode: boolean) => {
  const environment = getEnvironment(provider, isTestMode);
  try {
    switch (provider) {
      case "PADDLE": {
        const paddle = new Paddle(PAYMENT_API_KEY, { environment: environment });
        const productCollection = await paddle.products.list({ include: ["prices"] });
        const allItems: any[] = [];
        for await (const product of productCollection) {
          forEach(get(product, "prices", []), (price) => {
            allItems.push({ ...price, product: omit(product, "prices") });
          });
        }
        return JSON.parse(JSON.stringify(allItems));
      }
      case "DODO": {
        const dodo = new DodoPayments({ bearerToken: PAYMENT_API_KEY, environment: environment });
        const productList = await dodo.products.list();
        const items = get(productList, "items", []);
        return JSON.parse(JSON.stringify(items));
      }
      default:
        return [];
    }
  } catch (e) {
    return [];
  }
};

export const getDodoCheckoutSession = async (payload: any, isTestMode: boolean) => {
  const dodo = new DodoPayments({ bearerToken: PAYMENT_API_KEY, environment: getEnvironment("DODO", isTestMode) });
  const checkoutSession = await dodo.checkoutSessions.create({
    product_cart: [{ product_id: payload?.planItem?.priceId, quantity: 1 }],
    customer: { email: payload?.user?.email || "", ...(payload?.user?.name && { name: payload?.user?.name }) },
    return_url: payload?.returnUrl || "",
    customization: { theme: "light" },
  });
  return checkoutSession;
};
