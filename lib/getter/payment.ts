"use server";

import { Paddle } from "@paddle/paddle-node-sdk";
import DodoPayments from "dodopayments";
import { forEach, get, omit } from "lodash";

const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY!;

const getEnvironment = (provider: string): any => {
  const isDevMode = process.env.NODE_ENV === "development";
  switch (provider) {
    case "PADDLE":
      return isDevMode ? "sandbox" : "production";
    case "DODO":
      return isDevMode ? "test_mode" : "live_mode";
  }
};

export const getProductList = async (provider: string) => {
  const environment = getEnvironment(provider);
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

export const getDodoCheckoutSession = async (payload: any) => {
  const dodo = new DodoPayments({ bearerToken: PAYMENT_API_KEY, environment: getEnvironment("DODO") });
  const checkoutSession = await dodo.checkoutSessions.create({
    product_cart: [{ product_id: payload?.planItem?.priceId, quantity: 1 }],
    customer: { email: payload?.user?.email || "", ...(payload?.user?.name && { name: payload?.user?.name }) },
    return_url: payload?.returnUrl || "",
    customization: { theme: "light" },
  });
  return checkoutSession;
};
