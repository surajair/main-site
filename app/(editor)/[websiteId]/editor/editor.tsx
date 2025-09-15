"use client";

import { registerBlocks } from "@/blocks";
import WebsiteSettings from "@/components/website-settings";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { registerPanels } from "@/utils/register-panels";
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

export default function Editor({ domain, websiteId }: { domain?: string; websiteId?: string }) {
  const { ready } = useSupabaseUser();
  return ready ? (
    <ChaiBuilder
      apiUrl="editor/api"
      logo={() => <WebsiteSettings websiteId={websiteId} />}
      getPreviewUrl={(slug: string) => getPreviewUrl(slug, domain)}
      getLiveUrl={(slug: string) => getLiveUrl(slug, domain)}
    />
  ) : null;
}
