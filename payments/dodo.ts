import { getDodoCheckoutSession, getProductList } from "@/lib/getter/payment";
import { DodoPayments } from "dodopayments-checkout";
import { find } from "lodash";
import { PaymentProviderInterface, TPaymentProviderInitializeOptions } from ".";
import { getReturnURL, priceWithCurrency } from "./helper";

export class DodoAdapter implements PaymentProviderInterface {
  private dodo: any;
  private paymentConfig: any;
  private options: TPaymentProviderInitializeOptions | undefined;

  constructor(paymentConfig: any) {
    this.paymentConfig = paymentConfig;
  }

  async initialize(options?: TPaymentProviderInitializeOptions) {
    this.options = options;
    this.dodo = DodoPayments.Initialize({
      mode: process.env.NODE_ENV === "development" ? "test" : "live",
      onEvent: (event) => {
        if (event.event_type === "checkout.error") {
          this.options?.onStatusChange("error");
        }
      },
    });
    return this.dodo;
  }

  async getPricingPlans(): Promise<any[]> {
    const items = await getProductList("DODO");
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
        features: JSON.parse((monthlyItem?.metadata?.plans as any) || "[]"),
        items: [
          { billingCycle: "monthly", priceId: monthlyProduct?.id, quantity: 1 },
          { billingCycle: "yearly", priceId: yearlyProduct?.id, quantity: 1 },
        ],
      };
    });
    return plans;
  }

  async openCheckout(options: any = {}): Promise<any> {
    const returnUrl = getReturnURL("DODO");
    const checkout = await getDodoCheckoutSession({ ...options, returnUrl });
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
