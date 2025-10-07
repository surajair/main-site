import { getDodoCheckoutSession, getProductList } from "@/lib/getter/payment";
import { DodoPayments } from "dodopayments-checkout";
import { find, includes, map } from "lodash";
import { PaymentProviderInterface, TPaymentProviderInitializeOptions } from ".";
import { getReturnURL, priceWithCurrency } from "./helper";

export class DodoAdapter implements PaymentProviderInterface {
  private dodo: any;
  private paymentConfig: any;
  private options: TPaymentProviderInitializeOptions | undefined;
  private provider: "DODO";
  public isTestMode: boolean;

  constructor(paymentConfig: any) {
    this.provider = "DODO";
    this.paymentConfig = paymentConfig;
    this.isTestMode = this.paymentConfig?.environment === "sandbox";
  }

  async initialize(options?: TPaymentProviderInitializeOptions) {
    this.options = options;
    this.dodo = DodoPayments.Initialize({
      mode: this.isTestMode ? "test" : "live",
      onEvent: (event) => {
        if (event.event_type === "checkout.error") {
          this.options?.onStatusChange("error");
        }
      },
    });
    return this.dodo;
  }

  async getPricingPlans(): Promise<any[]> {
    const items = await getProductList(this.provider, this.isTestMode);
    const plans = this.paymentConfig?.plans?.map((subPlans: any) => {
      const monthlyProduct = find(subPlans, { period: "monthly" });
      const yearlyProduct = find(subPlans, { period: "yearly" });
      const monthlyItem = find(items, { product_id: monthlyProduct?.id });
      const yearlyItem = find(items, { product_id: yearlyProduct?.id });

      return {
        id: monthlyProduct?.id,
        name: monthlyProduct?.name,
        monthlyPrice: priceWithCurrency(monthlyItem?.price || 0, "USD"),
        yearlyPrice: priceWithCurrency(yearlyItem?.price || 0, "USD"),
        isFree: monthlyItem?.price === 0,
        features: JSON.parse((monthlyItem?.metadata?.plans as any) || "[]"),
        items: [
          { billingCycle: "monthly", priceId: monthlyProduct?.id, quantity: 1 },
          { billingCycle: "yearly", priceId: yearlyProduct?.id, quantity: 1 },
        ],
      };
    });
    return plans;
  }

  isCurrentPlan(currentPlanId: string, plan: any): boolean {
    return includes(map(plan?.items, "priceId"), currentPlanId);
  }

  async openCheckout(options: any = {}): Promise<any> {
    const returnUrl = getReturnURL(this.provider);
    const checkout = await getDodoCheckoutSession({ ...options, returnUrl }, this.isTestMode);
    DodoPayments.Checkout.open({
      checkoutUrl: checkout?.checkout_url,
    });
    return checkout;
  }

  async closeCheckout(): Promise<any> {
    DodoPayments.Checkout.close();
    return null;
  }
}
