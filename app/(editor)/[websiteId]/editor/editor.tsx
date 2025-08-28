"use client";

import { useSupabaseUser } from "@/hooks/use-supabase-user";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";

export default function Editor({ domain }: { domain?: string }) {
  const { ready } = useSupabaseUser();

  return ready ? (
    <ChaiBuilder
      apiUrl="editor/api"
      getPreviewUrl={(slug: string) =>
        `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
      }
      getLiveUrl={(slug: string) =>
        `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
      }
    />
  ) : null;
}
