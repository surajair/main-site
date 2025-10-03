import { getAndUpdateSubscriptionDetails } from "@/actions/update-user-plan";
import { formatPrice } from "@/lib/utils";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { chunk, get } from "lodash";
import { PaymentProviderInterface, TPaymentProviderInitializeOptions } from ".";

export class PaddleAdapter implements PaymentProviderInterface {
  private paddle: Paddle | any;
  private paymentConfig: any;
  private options: TPaymentProviderInitializeOptions | undefined;

  constructor(paymentConfig: any) {
    this.paymentConfig = paymentConfig;
  }

  async initialize(options?: TPaymentProviderInitializeOptions) {
    this.options = options;
    this.paddle = (await initializePaddle({
      token: this.paymentConfig.token,
      environment: process.env.NODE_ENV === "development" ? "sandbox" : "production",
      checkout: {
        settings: {
          displayMode: "overlay",
          variant: "one-page",
        },
      },
      eventCallback: async (event) => {
        if (event.name === "checkout.completed") {
          const transactionId = get(event, "data.transaction_id") as string;
          this.options?.onStatusChange("processing");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this.closeCheckout();
          await getAndUpdateSubscriptionDetails(transactionId);
          this.options?.onStatusChange("success");
        } else if (event.name === "checkout.error") {
          this.options?.onStatusChange("error");
        }
      },
    })) as Paddle;
    return this.paddle;
  }

  async getPricingPlans(): Promise<any[]> {
    const configPlans = this.paymentConfig?.plans;
    if (!configPlans || configPlans?.length === 0) return [];

    const paddleItems: any[] = [];
    configPlans?.forEach((plans: any) =>
      plans?.forEach((plan: any) => paddleItems.push({ priceId: plan.id, quantity: 1 })),
    );
    if (paddleItems?.length === 0) return [];

    const response = await this.paddle?.PricePreview({ items: paddleItems });
    const items = response?.data?.details?.lineItems;
    const plans = chunk(items, 2);
    if (plans?.length === 0) return [];

    return plans
      ?.map((plan: any) => {
        if (plan?.length === 0) return null;
        const monthlyItem = plan?.find((item: any) => item?.price?.billingCycle?.interval === "month");
        const isFree = monthlyItem?.totals?.total === "0";
        const yearlyItem = plan?.find(
          (item: any) => item?.price?.billingCycle?.interval === (isFree ? "month" : "year"),
        );

        return {
          id: plan?.id,
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
  }

  async openCheckout(options: any): Promise<any> {
    await this.paddle?.Checkout?.open({
      customer: {
        email: options?.user?.email || "",
      },
      items: [
        {
          priceId: options?.planItem?.priceId,
          quantity: 1,
        },
      ],
    });
    return null;
  }

  closeCheckout(): void {
    this.paddle?.Checkout?.close();
  }
}
