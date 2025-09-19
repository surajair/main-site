import { formatPrice } from "@/lib/utils";
import { Paddle } from "@paddle/paddle-js";
import { chunk } from "lodash";

export type PaymentConfig = {
  isDev: boolean;
  token: string;
  provider: String;
  plans: Array<{ id: String; period: String }>;
};

export const getPaymentConfig = (): PaymentConfig => {
  try {
    const config = process.env.NEXT_PUBLIC_PAYMENT_CONFIG || `{}`;
    const data = JSON.parse(config) || {};
    return { ...data, isDev: process.env.NODE_ENV === "development" };
  } catch (error) {
    return {} as PaymentConfig;
  }
};

export const getPricingPlans = async (paddle: Paddle): Promise<any> => {
  const config = getPaymentConfig();
  if (!config || config.plans?.length === 0) return [];

  const paddleItems: any[] = [];
  config.plans?.forEach((plans: any) =>
    plans?.forEach((plan: any) => paddleItems.push({ priceId: plan.id, quantity: 1 })),
  );
  if (paddleItems?.length === 0) return [];

  const response = await paddle?.PricePreview({ items: paddleItems });
  const items = response?.data?.details?.lineItems;
  const plans = chunk(items, 2);
  if (plans?.length === 0) return [];

  return plans
    ?.map((plan: any) => {
      if (plan?.length === 0) return null;
      const monthlyItem = plan?.find((item: any) => item?.price?.billingCycle?.interval === "month");
      const isFree = monthlyItem?.totals?.total === "0";
      const yearlyItem = plan?.find((item: any) => item?.price?.billingCycle?.interval === (isFree ? "month" : "year"));

      return {
        id: isFree ? "free" : "pro",
        name: monthlyItem?.product?.name,
        monthlyPrice: formatPrice(monthlyItem?.formattedUnitTotals?.total),
        yearlyPrice: formatPrice(yearlyItem?.formattedUnitTotals?.total),
        features: JSON.parse((monthlyItem?.product?.customData?.plans as any) || "[]"),
        items: [
          { billingCycle: "monthly", priceId: monthlyItem?.price?.id, quantity: 1 },
          { billingCycle: "yearly", priceId: yearlyItem?.price?.id, quantity: 1 },
        ],
      };
    })
    .filter((plan: any) => plan);
};
