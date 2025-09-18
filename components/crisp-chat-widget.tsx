"use client";
import Script from "next/script";

export const CrispChatWidget = () => {
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  if (!crispWebsiteId) return null;
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
