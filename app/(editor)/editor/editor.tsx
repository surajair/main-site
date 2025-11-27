"use client";

import { registerBlocks } from "@/blocks";
import { supabase } from "@/chai/supabase";
import WebsiteSettings from "@/components/website-settings";
import { registerFonts } from "@/fonts";
import { registerPanels } from "@/utils/register-panels";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoginForm from "./login";

type LoggedInUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  metadata?: Record<string, any>;
};

localStorage.setItem("chai-feature-flags", JSON.stringify(["enable-ai-chat-panel"]));
registerPanels();
registerBlocks();
registerFonts();

export default function Editor({ websiteId }: { websiteId?: string }) {
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
    (slug: string) => `/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`,
    [],
  );

  const getLiveUrl = useCallback(
    (slug: string) => `/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`,
    [],
  );

  if (!user) {
    return <LoginForm />;
  }

  return (
    <ChaiBuilder
      flags={{ exportCode: true, dragAndDrop: true }}
      currentUser={user}
      autoSave
      autoSaveInterval={20}
      getAccessToken={getAccessToken}
      hasReactQueryProvider
      apiUrl={`/editor/api`}
      // @ts-ignore
      topLeftCorner={() => websiteSettings}
      getPreviewUrl={getPreviewUrl}
      getLiveUrl={getLiveUrl}
      websocket={supabase}
    />
  );
}
