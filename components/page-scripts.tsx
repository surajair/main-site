import { GoogleTagManager } from "@next/third-parties/google";
import ChaiBuilder from "chai-next/server";
import Script from "next/script";

export const PageScripts = () => {
  if (ChaiBuilder.getSiteId() !== "70edd9d5-8026-4d3c-b902-fd3bb32cdaef") {
    return null;
  }

  return (
    <>
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "f9du7ptib5");
        `,
        }}
      />
      <GoogleTagManager gtmId="GTM-WT5NSQ7" />
    </>
  );
};
