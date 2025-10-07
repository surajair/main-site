import { updateUserPayment } from "@/actions/update-user-payment";
import { getProductList } from "@/lib/getter/payment";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { find, get } from "lodash";
import { PaymentProviderInterface, TPaymentProviderInitializeOptions } from ".";
import { getReturnURL, priceWithCurrency } from "./helper";

export class PaddleAdapter implements PaymentProviderInterface {
  private paddle: Paddle | any;
  private paymentConfig: any;
  private options: TPaymentProviderInitializeOptions | undefined;
  private provider: "PADDLE";
  public isTestMode: boolean;

  constructor(paymentConfig: any) {
    this.provider = "PADDLE";
    this.paymentConfig = paymentConfig;
    this.isTestMode = this.paymentConfig?.environment === "sandbox";
  }

  async initialize(options?: TPaymentProviderInitializeOptions) {
    this.options = options;
    this.paddle = (await initializePaddle({
      token: this.paymentConfig.token,
      environment: this.isTestMode ? "sandbox" : "production",
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
          await new Promise((resolve) => setTimeout(resolve, 300));
          updateUserPayment("PADDLE", transactionId);
          const returnUrl = getReturnURL("PADDLE", { transaction_id: transactionId, status: "active" });
          window.location.href = returnUrl;
        } else if (event.name === "checkout.error") {
          this.options?.onStatusChange("error");
        }
      },
    })) as Paddle;
    return this.paddle;
  }

  async getPricingPlans(): Promise<any[]> {
    const items = await getProductList(this.provider, this.isTestMode);
    const plans = this.paymentConfig?.plans?.map((subPlans: any) => {
      const monthlyProduct = find(subPlans, { period: "monthly" });
      const yearlyProduct = find(subPlans, { period: "yearly" });
      const monthlyItem = find(items, { id: monthlyProduct?.id });
      const yearlyItem = find(items, { id: yearlyProduct?.id });

      return {
        id: monthlyItem?.product?.id,
        name: get(monthlyItem, "product.name", ""),
        monthlyPrice: priceWithCurrency(
          get(monthlyItem, "unitPrice.amount", 0),
          get(monthlyItem, "unitPrice.currencyCode", ""),
        ),
        yearlyPrice: priceWithCurrency(
          get(yearlyItem, "unitPrice.amount", 0),
          get(yearlyItem, "unitPrice.currencyCode", ""),
        ),
        isFree: monthlyItem?.unitPrice.amount === 0,
        features: JSON.parse(get(monthlyItem, "product.customData.plans", "[]")),
        items: [
          {
            billingCycle: "monthly",
            priceId: monthlyProduct?.id,
            quantity: 1,
            price: get(monthlyItem, "unitPrice.amount", 0),
          },
          {
            billingCycle: "yearly",
            priceId: yearlyProduct?.id,
            quantity: 1,
            price: get(yearlyItem, "unitPrice.amount", 0),
          },
        ],
      };
    });
    return plans;
  }

  isCurrentPlan(currentPlanId: string, plan: any): boolean {
    return plan?.id === currentPlanId;
  }

  async openCheckout(options: any): Promise<any> {
    await this.paddle?.Checkout?.open({
      customer: { email: options?.user?.email || "" },
      items: [{ priceId: options?.planItem?.priceId, quantity: 1 }],
    });
    return null;
  }

  closeCheckout(): void {
    this.paddle?.Checkout?.close();
  }
}
