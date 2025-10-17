"use client";

import { registerBlocks } from "@/blocks";
import { supabase } from "@/chai/supabase";
import WebsiteSettings from "@/components/website-settings";
import { registerFonts } from "@/fonts";
import { registerPanels } from "@/utils/register-panels";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

type LoggedInUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  metadata?: Record<string, any>;
};

registerPanels();
registerBlocks();
registerFonts();

export default function Editor({ domain, websiteId }: { domain?: string; websiteId?: string }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const websiteSettings = useMemo(() => <WebsiteSettings websiteId={websiteId} />, [websiteId]);

  useEffect(() => {
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.name,
        } as LoggedInUser);
      }
    };
    checkInitialSession();
  }, []);

  const getAccessToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? "";
  }, []);

  const getPreviewUrl = useCallback(
    (slug: string) => `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`,
    [domain],
  );

  const getLiveUrl = useCallback(
    (slug: string) => `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`,
    [domain],
  );

  if (!user) {
    return null;
  }

  return (
    <ChaiBuilder
      currentUser={user}
      autoSave
      autoSaveInterval={20}
      getAccessToken={getAccessToken}
      hasReactQueryProvider
      apiUrl={`/${websiteId}/editor/api`}
      // @ts-ignore
      topLeftCorner={() => websiteSettings}
      getPreviewUrl={getPreviewUrl}
      getLiveUrl={getLiveUrl}
      websocket={supabase}
    />
  );
}
