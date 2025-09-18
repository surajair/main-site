"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

export const CrispChatWidget = () => {
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  const domain = process.env.APP_DOMAIN;
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    const shouldShow = window.location.hostname.includes(`${domain}`);
    setShowWidget(shouldShow);
  }, [domain]);
  if (!crispWebsiteId) return null;
  if (!showWidget) return null;

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
