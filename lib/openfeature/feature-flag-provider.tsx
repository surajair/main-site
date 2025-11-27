"use client";

import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import { useIsBuilderSettingUp } from "@/hooks/use-is-builder-setting-up";
import { useUser } from "@/hooks/use-user";
import { OpenFeatureProvider } from "@openfeature/react-sdk";
import React, { useState } from "react";

function FeatureFlagProviderComponent({
  children,
  fromDashboard,
}: {
  children: React.ReactNode;
  fromDashboard?: boolean;
}) {
  const [loading] = useState(true);
  const { isBuilderReady } = useIsBuilderSettingUp(loading);
  const { data } = useUser();

  const showChildren = data?.isLoggedIn;
  const isLoading = loading || !showChildren || (fromDashboard ? false : !isBuilderReady);

  return (
    <>
      {isLoading && <p>loading...</p>}
      {showChildren && (
        <div className={`${isLoading ? "sr-only" : ""}`}>
          <OpenFeatureProvider>
            <>{children}</>
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
