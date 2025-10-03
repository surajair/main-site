import { PaymentProviderInterface } from ".";

export class DodoAdapter implements PaymentProviderInterface {
  private dodo: any;
  private paymentConfig: any;
  constructor(paymentConfig: any) {
    this.paymentConfig = paymentConfig;
  }

  async initialize(options?: Record<string, any>) {
    // TODO : Initialize dodo
    return null;
  }

  async getPricingPlans(): Promise<any[]> {
    // TODO : Get pricing plans
    return [];
  }

  async openCheckout(options: any): Promise<any> {
    // TODO : Open checkout
    return null;
  }

  async closeCheckout(): Promise<any> {
    // TODO : Close checkout
    return null;
  }
}
