"use client";

import { registerBlocks } from "@/blocks";
import WebsiteSettings from "@/components/website-settings";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { registerPanels } from "@/utils/register-panels";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";

const getPreviewUrl = (slug: string, domain?: string) => {
  return `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`;
};

const getLiveUrl = (slug: string, domain?: string) => {
  return `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`;
};
registerPanels();
registerBlocks();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
export default function Editor({ domain, websiteId }: { domain?: string; websiteId?: string }) {
  const { ready } = useSupabaseUser();
  return ready ? (
    <QueryClientProvider client={queryClient}>
      <ChaiBuilder
        hasReactQueryProvider
        apiUrl="editor/api"
        logo={() => <WebsiteSettings websiteId={websiteId} />}
        getPreviewUrl={(slug: string) => getPreviewUrl(slug, domain)}
        getLiveUrl={(slug: string) => getLiveUrl(slug, domain)}
      />
    </QueryClientProvider>
  ) : null;
}
