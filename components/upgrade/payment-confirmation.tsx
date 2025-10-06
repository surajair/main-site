"use client";

import { updateUserPayment } from "@/actions/update-user-payment";
import { Button } from "chai-next";
import { useEffect } from "react";

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
    <div className="w-screen h-screen flex items-center justify-center">
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
            Continue to editor
          </Button>
        </div>
      </div>
    </div>
  );
}
