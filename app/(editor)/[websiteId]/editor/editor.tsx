"use client";

import WebsiteSettingModal from "@/components/website-setting-modal";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";

const queryClient = new QueryClient();

export default function Editor({ domain, websiteId }: { domain?: string; websiteId?: string }) {
  const { ready } = useSupabaseUser();

  return ready ? (
    <QueryClientProvider client={queryClient}>
      <ChaiBuilder
        logo={() => <WebsiteSettingModal websiteId={websiteId} />}
        apiUrl="editor/api"
        getPreviewUrl={(slug: string) =>
          `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
        }
        getLiveUrl={(slug: string) =>
          `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
        }
      />
    </QueryClientProvider>
  ) : null;
}
