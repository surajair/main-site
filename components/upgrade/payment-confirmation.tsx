"use client";

import { Button } from "chai-next";
import { useSearchParams } from "next/navigation";
import PlaceholderBuilderUI from "../providers/placeholder-builder-ui";
import { Card } from "../ui/card";

export default function PaymentConfirmation() {
  const params = useSearchParams();
  const status = params.get("status") || "active";

  const handleReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("status");
    url.searchParams.delete("provider");
    url.searchParams.delete("subscription_id");
    url.searchParams.delete("transaction_id");
    window.location.replace(url.toString());
  };

  return (
    <PlaceholderBuilderUI>
      <Card className="w-full max-w-md mx-auto p-6 bg-white">
        {status === "failed" ? (
          <div className="p-8 text-center max-w-md w-full">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We could not process your payment. Please try again or contact support.
            </p>
            <br />
            <Button size="lg" onClick={handleReload}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="p-8 text-center max-w-md w-full">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for upgrading! Your subscription has been activated.</p>
            <br />
            <Button size="lg" onClick={handleReload}>
              Continue
            </Button>
          </div>
        )}
      </Card>
    </PlaceholderBuilderUI>
  );
}
