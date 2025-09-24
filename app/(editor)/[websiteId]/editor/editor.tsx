"use client";

import { registerBlocks } from "@/blocks";
import { supabase } from "@/chai/supabase";
import WebsiteSettings from "@/components/website-settings";
import { registerFonts } from "@/fonts";
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
registerFonts();

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
        getAccessToken={async () => {
          const { data, error } = await supabase.auth.getSession();
          console.log("getAccessToken", data, error);
          return data?.session?.access_token ?? "";
        }}
        hasReactQueryProvider
        apiUrl="editor/api"
        logo={() => <WebsiteSettings websiteId={websiteId} />}
        getPreviewUrl={(slug: string) => getPreviewUrl(slug, domain)}
        getLiveUrl={(slug: string) => getLiveUrl(slug, domain)}
      />
    </QueryClientProvider>
  ) : null;
}
