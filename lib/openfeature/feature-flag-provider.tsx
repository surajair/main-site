"use client";

import { InMemoryProvider, OpenFeature, OpenFeatureProvider } from "@openfeature/react-sdk";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export function FeatureFlagProvider({ children, featureFlags }: { children: React.ReactNode; featureFlags?: any }) {
  const [providerReady, setProviderReady] = useState(false);

  useEffect(() => {
    try {
      const provider = new InMemoryProvider(featureFlags);
      OpenFeature.setProvider(provider);
      setProviderReady(true);
    } catch {}
  }, [featureFlags]);

  if (!providerReady) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader className="text-primary animate-spin w-6 h-6" />
      </div>
    );
  }

  return <OpenFeatureProvider>{children}</OpenFeatureProvider>;
}
