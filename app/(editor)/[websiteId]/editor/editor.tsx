"use client";

import { registerBlocks } from "@/blocks";
import { supabase } from "@/chai/supabase";
import WebsiteSettings from "@/components/website-settings";
import { registerFonts } from "@/fonts";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { registerPanels } from "@/utils/register-panels";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";
import { useMemo } from "react";

const getPreviewUrl = (slug: string, domain?: string) => {
  return `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`;
};

const getLiveUrl = (slug: string, domain?: string) => {
  return `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`;
};

registerPanels();
registerBlocks();
registerFonts();

export default function Editor({ domain, websiteId }: { domain?: string; websiteId?: string }) {
  const { ready } = useSupabaseUser();
  const websiteSettings = useMemo(() => <WebsiteSettings websiteId={websiteId} />, [websiteId]);
  return ready ? (
    <ChaiBuilder
      autoSave
      autoSaveInterval={20}
      getAccessToken={async () => {
        const { data } = await supabase.auth.getSession();
        return data?.session?.access_token ?? "";
      }}
      hasReactQueryProvider
      apiUrl="editor/api"
      // @ts-ignore
      topLeftCorner={() => websiteSettings}
      getPreviewUrl={(slug: string) => getPreviewUrl(slug, domain)}
      getLiveUrl={(slug: string) => getLiveUrl(slug, domain)}
    />
  ) : null;
}
