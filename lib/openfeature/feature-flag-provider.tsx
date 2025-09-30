"use client";

import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import { useClientSettings } from "@/hooks/use-client-settings";
import { useIsBuilderSettingUp } from "@/hooks/use-is-builder-setting-up";
import { useUser } from "@/hooks/use-user";
import { useWebsites } from "@/hooks/use-websites";
import { InMemoryProvider, OpenFeature, OpenFeatureProvider } from "@openfeature/react-sdk";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { convertToOpenFeatureDevFormat } from "./helper";

// Lazy load the UpgradeDialog component
const UpgradeDialog = dynamic(() => import("@/components/upgrade/upgrade-modal"), {
  ssr: false,
});

function FeatureFlagProviderComponent({ children }: { children: React.ReactNode }) {
  useWebsites();
  const [loading, setLoading] = useState(true);
  const { data: clientSettings } = useClientSettings();
  const isBuilderSettingUp = useIsBuilderSettingUp(loading);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { data } = useUser();

  const role = data?.role;
  const plan = data?.plan?.planId;

  useEffect(() => {
    if (clientSettings && plan && role) {
      const flags = convertToOpenFeatureDevFormat(clientSettings?.features, role, plan);
      const provider = new InMemoryProvider(flags);
      OpenFeature.setProvider(provider);
      OpenFeature.setContext({
        plan,
        role,
        showUpgrade: (() => setShowUpgradeDialog(true)) as any,
      });
      setTimeout(() => setLoading(false), 1000);
    }
  }, [clientSettings, plan, role]);

  const showEditor = clientSettings && data?.isLoggedIn;
  const isLoading = loading || isBuilderSettingUp || !showEditor;

  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen flex items-center justify-center transition-all">
          <Loader className="text-green-600 animate-spin w-6 h-6" />
        </div>
      )}
      {showEditor && (
        <div className={`${isLoading ? "sr-only" : ""}`}>
          <OpenFeatureProvider>{children}</OpenFeatureProvider>
        </div>
      )}
      {showUpgradeDialog && <UpgradeDialog onClose={() => setShowUpgradeDialog(false)} />}
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
