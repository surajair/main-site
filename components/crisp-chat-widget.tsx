"use client";
import Script from "next/script";
import { useEffect } from "react";

export const CrispChatWidget = () => {
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  if (!crispWebsiteId) return null;
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chai-feature-flags", JSON.stringify(["enable-ai-chat-panel"]));
    }
  }, []);
  return (
    <Script
      id="crisp-chat-widget"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="${crispWebsiteId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
      }}
    />
  );
};
