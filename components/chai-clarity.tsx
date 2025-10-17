import { isEmpty } from "lodash";
import Script from "next/script";

export const ChaiClarity = () => {
  return !isEmpty(process.env.NEXT_PUBLIC_CLARITY_ID) ? (
    <Script
      id="chaibuilder-app-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
  `,
      }}
    />
  ) : null;
};
