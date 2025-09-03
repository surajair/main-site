"use client";

import { InMemoryProvider, OpenFeature, OpenFeatureProvider } from "@openfeature/react-sdk";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllFeatures } from "./helper";

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [providerReady, setProviderReady] = useState(false);

  useEffect(() => {
    async function loadFlags() {
      try {
        const res = await fetch("/features.json");
        const flags = await res.json();
        const updateFlags: any = getAllFeatures(flags);
        const provider = new InMemoryProvider(updateFlags);
        OpenFeature.setProvider(provider);
        setProviderReady(true);
      } catch {}
    }

    loadFlags();
  }, []);

  if (!providerReady) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader className="text-primary animate-spin w-6 h-6" />
      </div>
    );
  }

  return <OpenFeatureProvider>{children}</OpenFeatureProvider>;
}
