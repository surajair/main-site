"use client";

import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import { getClientSettings, getSites } from "@/lib/getter";
import { InMemoryProvider, OpenFeature, OpenFeatureProvider } from "@openfeature/react-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

function FeatureFlagProviderComponent({ children, featureFlags }: { children: React.ReactNode; featureFlags?: any }) {
  const [loading, setLoading] = useState(true);
  const [providerReady, setProviderReady] = useState(false);
  const queryClient = useQueryClient();

  queryClient.prefetchQuery({
    staleTime: Infinity,
    gcTime: Infinity,
    queryKey: ["client-settings"],
    queryFn: getClientSettings,
  });
  queryClient.prefetchQuery({ staleTime: Infinity, gcTime: Infinity, queryKey: ["websites-list"], queryFn: getSites });

  useEffect(() => {
    try {
      const provider = new InMemoryProvider(featureFlags);
      OpenFeature.setProvider(provider);
      setProviderReady(true);
      setTimeout(() => setLoading(false), 1000);
    } catch {}
  }, [featureFlags]);

  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex items-center justify-center">
          <Loader className="text-primary animate-spin w-6 h-6" />
        </div>
      )}
      {providerReady && (
        <div className={loading ? "sr-only" : ""}>
          <OpenFeatureProvider>{children}</OpenFeatureProvider>
        </div>
      )}
    </>
  );
}

export const FeatureFlagProvider = ({ children, featureFlags }: { children: React.ReactNode; featureFlags?: any }) => {
  return (
    <QueryClientProviderWrapper>
      <FeatureFlagProviderComponent featureFlags={featureFlags}>{children}</FeatureFlagProviderComponent>
    </QueryClientProviderWrapper>
  );
};
