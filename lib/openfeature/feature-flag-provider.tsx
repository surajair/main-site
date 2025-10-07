"use client";

import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import { useClientSettings } from "@/hooks/use-client-settings";
import { useIsBuilderSettingUp } from "@/hooks/use-is-builder-setting-up";
import { useUser } from "@/hooks/use-user";
import { useWebsites } from "@/hooks/use-websites";
import { InMemoryProvider, OpenFeature, OpenFeatureProvider } from "@openfeature/react-sdk";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { convertToOpenFeatureDevFormat } from "./helper";

// Lazy load the UpgradeDialog component
const UpgradeDialog = dynamic(() => import("@/components/upgrade/upgrade-modal"), {
  ssr: false,
});

import React from "react";

const StartingLoader = ({ logo, progress }: { logo: any; progress: number }) => {
  const [localLogo] = useState(window.localStorage.getItem("client-logo"));
  const [localProgress, setLocalProgress] = useState(0);

  useEffect(() => {
    setLocalProgress((prev) => Math.max(prev, progress));
    let interval = setInterval(() => {
      setLocalProgress((prev) => Math.min(prev + 2, 100));
    }, 400);
    return () => clearInterval(interval);
  }, [progress]);

  const loader = useMemo(
    () => (
      <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center transition-all">
        {localLogo || logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo || localLogo} className="w-8 h-8 rounded" alt="" />
        ) : (
          <div className="w-8 h-8" />
        )}
        <div style={{ width: "200px" }} className={`w-[200px] rounded-full h-2.5 border border-border overflow-hidden`}>
          <div
            className={`h-full rounded-full bg-primary transition-all duration-300`}
            style={{
              width: `${Math.min(localProgress, 100)}%`,
            }}
          />
        </div>
      </div>
    ),
    [localProgress, localLogo, logo],
  );

  return loader;
};

function FeatureFlagProviderComponent({
  children,
  fromDashboard,
}: {
  children: React.ReactNode;
  fromDashboard?: boolean;
}) {
  useWebsites();
  const [loading, setLoading] = useState(true);
  const { data: clientSettings } = useClientSettings();
  const { isBuilderReady, setupProgress } = useIsBuilderSettingUp(loading);
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

  const showChildren = clientSettings && data?.isLoggedIn;
  const isLoading = loading || !showChildren || (fromDashboard ? false : !isBuilderReady);
  const progress = [plan ? 20 : 0, clientSettings ? 25 : 0, fromDashboard ? 40 : setupProgress].reduce(
    (a, b) => a + b,
    5,
  );

  return (
    <>
      {isLoading && <StartingLoader logo={clientSettings?.logo} progress={progress} />}
      {showChildren && (
        <div className={`${isLoading ? "sr-only" : ""}`}>
          <OpenFeatureProvider>
            <>
              {children}
              {showUpgradeDialog && <UpgradeDialog onClose={() => setShowUpgradeDialog(false)} />}
            </>
          </OpenFeatureProvider>
        </div>
      )}
    </>
  );
}

export const FeatureFlagProvider = ({
  children,
  fromDashboard = false,
}: {
  children: React.ReactNode;
  fromDashboard?: boolean;
}) => {
  return (
    <QueryClientProviderWrapper>
      <FeatureFlagProviderComponent fromDashboard={fromDashboard}>{children}</FeatureFlagProviderComponent>
    </QueryClientProviderWrapper>
  );
};
