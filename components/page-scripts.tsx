import { generateScriptId } from "@/lib/constants/get-script-id";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import ChaiBuilder, { getSupabaseAdmin } from "chai-next/server";
import Script from "next/script";

const renderCustomScript = (script: string, index: number) => {
  const trimmedScript = script.trim();
  const scriptId = generateScriptId(trimmedScript, index);

  // Handle URL scripts
  if (/^https?:\/\//.test(trimmedScript)) {
    return <Script key={index} id={scriptId} src={trimmedScript} strategy="afterInteractive" />;
  }

  // Handle scripts with HTML tags
  const scriptContent = /<script[^>]*>/.test(trimmedScript)
    ? trimmedScript.replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "")
    : trimmedScript;

  return (
    <Script key={index} id={scriptId} strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: scriptContent }} />
  );
};

export const PageScripts = async () => {
  const websiteId = ChaiBuilder.getSiteId();
  const supabaseServer = await getSupabaseAdmin();
  const { data, error }: any = await supabaseServer
    .from("apps")
    .select(`settings`)
    .is("deletedAt", null)
    .eq("id", websiteId)
    .single();
  const settings = data?.settings;
  if (error || !settings) {
    console.log("Error while fetching settings:", error?.message);
    return null;
  }
  return (
    <>
      {settings.metaPixelId && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${settings.metaPixelId}');
            fbq('track', 'PageView');
          `,
          }}
        />
      )}
      {settings.googleTagManagerId && <GoogleTagManager gtmId={settings.googleTagManagerId} />}
      {settings.googleAnalyticsId && <GoogleAnalytics gaId={settings.googleAnalyticsId} />}
      {settings.customTrackingScripts?.map(renderCustomScript)}
    </>
  );
};
