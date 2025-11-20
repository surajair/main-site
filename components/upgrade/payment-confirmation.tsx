"use client";

import { updateUserPayment } from "@/actions/update-user-payment";
import { Button } from "chai-next";
import { useEffect } from "react";
import PlaceholderBuilderUI from "../providers/placeholder-builder-ui";
import { Card } from "../ui/card";

export default function PaymentConfirmation({ provider, paymentId }: { provider: string; paymentId: string }) {
  useEffect(() => {
    if (paymentId) {
      const updatePayment = async () => {
        try {
          const { success } = await updateUserPayment(provider, paymentId);
          if (!success) return;
        } catch (error) {}
      };
      updatePayment();
    }
  }, [provider, paymentId]);

  return (
    <PlaceholderBuilderUI>
      <Card className="w-full max-w-md mx-auto p-6 bg-white">
        <div className="p-8 text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2l4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for upgrading! Your subscription has been activated.</p>
          <br />
          <Button
            size="lg"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete("status");
              url.searchParams.delete("provider");
              url.searchParams.delete("subscription_id");
              url.searchParams.delete("transaction_id");
              window.location.replace(url.toString());
            }}>
            Continue
          </Button>
        </div>
      </Card>
    </PlaceholderBuilderUI>
  );
}
