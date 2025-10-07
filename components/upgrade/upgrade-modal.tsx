"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentProvider } from "@/payments";
import { useChaiAuth } from "chai-next";
import { Check, Crown, Loader } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

function UpgradeModalContent() {
  const { user } = useChaiAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { plans, status, provider, isLoading, currentPlanId, savePercentage } = usePaymentProvider();

  const handleUpgrade = async (planItems: any[]) => {
    if (planItems.length === 0) return;
    const planItem = planItems?.find((item: any) => item.billingCycle === billingCycle);
    if (!planItem) return;
    await provider?.openCheckout({ user, planItem });
  };

  if (status === "processing") {
    return (
      <div className={`max-w-5xl min-h-[500px] mx-auto py-20 flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <Loader className="w-5 h-5 text-primary animate-spin" />
          <p className="text-center text-sm text-muted-foreground mt-2">Confirming payment</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={`max-w-5xl min-h-[500px] mx-auto py-20 flex items-center justify-center`}>
        <div className="p-8 text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="white" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2l4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for upgrading! Your subscription has been activated. To start using it,{" "}
            <span className="font-semibold">please reload the page.</span>
          </p>

          <Button size="lg" onClick={() => window.location.reload()}>
            Reload and Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`max-w-5xl mx-auto`}>
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground text-sm font-light">
            Upgrade to unlock more features and grow your online presence
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center mt-4">
            <div className="relative flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`relative px-4 py-1 text-sm font-medium rounded-md transition-all ease-linear duration-300 border-2 ${
                  billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-sm border-border"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                }`}>
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`relative px-4 py-1 text-sm font-medium rounded-md transition-all ease-linear duration-300 border ${
                  billingCycle === "yearly"
                    ? "bg-background text-foreground shadow-sm border-border"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                } ${plans?.length > 0 ? "" : "opacity-50 pointer-events-none cursor-not-allowed"}`}>
                Yearly
                {savePercentage && (
                  <span className="ml-2 text-[11px] text-green-600 font-normal px-1 bg-green-100 rounded-full">
                    Save {savePercentage}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mx-auto max-w-xl md:grid-cols-2 gap-6">
          {!plans || isLoading ? (
            <>
              <Card
                className={`relative min-h-[360px] transition-all ease-linear duration-300 hover:shadow-lg border-border hover:border-primary/50 bg-muted animate-pulse`}
              />
              <Card
                className={`relative min-h-[360px] transition-all ease-linear duration-300 hover:shadow-lg border-border hover:border-primary/50 bg-muted animate-pulse`}
              />
            </>
          ) : (
            plans?.map((plan: any) => {
              const id = plan.id;
              const currentPrice = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
              const period = plan?.isFree ? "" : billingCycle === "yearly" ? "/year" : "/month";
              const isCurrentPlan = provider.isCurrentPlan(currentPlanId, plan);

              return (
                <Card
                  key={id}
                  className={`relative min-h-[360px] transition-all ease-linear duration-300 hover:shadow-lg border-border ${plan?.isFree ? "" : "border-primary/50"}`}>
                  <CardHeader className="text-start pb-4">
                    <CardTitle className={`font-semibold ${plan?.isFree ? "text-muted-foreground" : "text-primary"}`}>
                      {plan?.name}
                    </CardTitle>
                    <div className="flex items-baseline justify-start mt-2">
                      <span className="text-3xl font-semibold">{currentPrice}</span>
                      <span className="text-muted-foreground ml-1">{period}</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-start text-sm font-semibold">Includes </div>
                    <ul className="space-y-1 mb-12 mt-2">
                      {plan?.features?.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-balance">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-[80%] mx-auto absolute right-1/2 bottom-5 transform translate-x-1/2"
                      variant={plan?.isFree || isCurrentPlan ? "outline" : "default"}
                      onClick={() => handleUpgrade(plan?.items)}
                      disabled={!plans || plan?.isFree || isCurrentPlan}>
                      {isCurrentPlan ? (
                        <>Current Plan</>
                      ) : plan?.isFree ? (
                        <>Free Plan</>
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade now
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
const UpgradeDialog = ({ onClose }: { onClose: () => void }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Upgrade now</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <UpgradeModalContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
