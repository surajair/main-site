"use client";

import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import { useClientSettings } from "@/hooks/use-client-settings";
import { useIsBuilderSettingUp } from "@/hooks/use-is-builder-setting-up";
import { useWebsites } from "@/hooks/use-websites";
import { InMemoryProvider, OpenFeature, OpenFeatureProvider } from "@openfeature/react-sdk";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { convertToOpenFeatureDevFormat } from "./helper";

function FeatureFlagProviderComponent({ children }: { children: React.ReactNode }) {
  useWebsites();
  const [loading, setLoading] = useState(true);
  const { data: clientSettings } = useClientSettings();
  const isBuilderSettingUp = useIsBuilderSettingUp(loading);

  useEffect(() => {
    if (clientSettings) {
      const plan = "pro_01k5drbfma56k4w3rgfsx7dhyd"; // pro_01k50tmqqxvn40q4gc7bgrw8mk
      const role = "admin";
      const flags = convertToOpenFeatureDevFormat(clientSettings?.features, role, plan);
      const provider = new InMemoryProvider(flags);
      OpenFeature.setProvider(provider);
      OpenFeature.setContext({ plan, role });
      setTimeout(() => setLoading(false), 1000);
    }
  }, [clientSettings]);

  const isLoading = loading || isBuilderSettingUp;

  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen flex items-center justify-center transition-all">
          <Loader className="text-primary animate-spin w-6 h-6" />
        </div>
      )}
      {clientSettings && (
        <div className={`${isLoading ? "sr-only" : ""}`}>
          <OpenFeatureProvider>{children}</OpenFeatureProvider>
        </div>
      )}
    </>
  );
}

export const FeatureFlagProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProviderWrapper>
      <FeatureFlagProviderComponent>{children}</FeatureFlagProviderComponent>
    </QueryClientProviderWrapper>
  );
};
