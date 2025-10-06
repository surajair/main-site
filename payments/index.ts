import { useClientSettings } from "@/hooks/use-client-settings";
import { useUserPlan } from "@/lib/openfeature/helper";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DodoAdapter } from "./dodo";
import { PaddleAdapter } from "./paddle";

// * Types
export type TStatus = "idle" | "processing" | "success" | "error";
export type TPaymentProviderInitializeOptions = {
  onStatusChange: (status: TStatus) => void;
} & Record<string, any>;

export interface PaymentProviderInterface {
  isCurrentPlan(currentPlanId: string, plan: any): boolean;
  initialize(options?: TPaymentProviderInitializeOptions): Promise<any>;
  getPricingPlans(): Promise<any[]>;
  openCheckout(options: any): Promise<any>;
  closeCheckout(): void;
}

export type TPaymentProvider = {
  provider: PaymentProviderInterface;
  plans: any[];
  isLoading: boolean;
  status: TStatus;
  currentPlanId: string;
};

// * Factories
export class PaymentProviderFactory {
  static createPaymentProvider(paymentConfig: any): PaymentProviderInterface {
    switch (paymentConfig.provider) {
      case "PADDLE":
        return new PaddleAdapter(paymentConfig);
      case "DODO":
        return new DodoAdapter(paymentConfig);
      default:
        throw new Error(`Unknown payment provider: ${paymentConfig.provider}`);
    }
  }
}

// * Hooks
export const usePaymentProvider = (options: Record<string, any> = {}): TPaymentProvider => {
  const [status, setStatus] = useState<TStatus>("idle");
  const { data: clientSettings } = useClientSettings();
  const value = useUserPlan();
  const currentPlanId = value?.id;

  const optionsWithState = {
    ...(options || {}),
    onStatusChange: (status: TStatus) => {
      setStatus(status);
    },
  };

  const { data, isLoading } = useQuery<any>({
    queryKey: ["PAYMENT_PROVIDER"],
    queryFn: async () => {
      const provider = PaymentProviderFactory.createPaymentProvider(clientSettings?.paymentConfig);
      await provider.initialize(optionsWithState);
      const plans = await provider.getPricingPlans();
      return { provider, plans };
    },
    enabled: !!clientSettings?.paymentConfig,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  return { provider: data?.provider, plans: data?.plans, currentPlanId, isLoading, status };
};
