import { registerBlocks } from "@/blocks";
import { ImageBlock } from "@/components/image";
import { PageScripts } from "@/components/page-scripts";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { loadSiteGlobalData } from "@/data/global";
import { getFontStyles, registerFonts } from "@/fonts";
import { getClientSettings } from "@/lib/getter";
import { Analytics } from "@vercel/analytics/next";
import { ChaiPageProps, loadWebBlocks } from "chai-next/blocks";
import { ChaiPageStyles, RenderChaiBlocks } from "chai-next/blocks/rsc";
import ChaiBuilder, { registerChaiGlobalDataProvider } from "chai-next/server";
import { isEmpty } from "lodash";
import dynamicImport from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

const ChaiCustomHtml = dynamicImport(() => import("@/components/chai-custom-html").then((mod) => mod.ChaiCustomHtml));
const ChaiBuilderBadge = dynamicImport(() => import("@/components/chai-builder-badge"));
const PreviewBanner = dynamicImport(() => import("chai-next/blocks/rsc").then((mod) => mod.PreviewBanner));
const CookieConsentWrapper = dynamicImport(() =>
  import("@/components/cookie-consent-wrapper").then((mod) => mod.CookieConsentWrapper),
);

loadWebBlocks();
registerBlocks();
registerChaiGlobalDataProvider(loadSiteGlobalData);
registerFonts();

export const dynamic = "force-static";

export const generateMetadata = async (props: { params: Promise<{ hostname: string; slug: string[] }> }) => {
  const nextParams = await props.params;
  const hostname = nextParams.hostname.replace("%3A", ":").replace("%2E", ".");
  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";

  const { isEnabled } = await draftMode();
  await ChaiBuilder.initByHostname(hostname, isEnabled);
  const data = await ChaiBuilder.getSiteSettings();
  const clientSettings = await getClientSettings();
  const favicon = data?.settings?.faviconURL || clientSettings.favicon;
  return {
    ...((await ChaiBuilder.getPageSeoData(slug)) as any),
    icons: { icon: favicon },
    metadataBase: new URL(`https://${hostname}`),
    alternates: {
      canonical: slug,
    },
  };
};

export default async function Page({ params }: { params: Promise<{ hostname: string; slug: string[] }> }) {
  const nextParams = await params;
  const hostname = nextParams.hostname.replace("%3A", ":").replace("%2E", ".");
  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";
  const { isEnabled } = await draftMode();
  await ChaiBuilder.initByHostname(hostname, isEnabled);
  const data = await ChaiBuilder.getSiteSettings();
  const clientSettings = await getClientSettings();
  const settings = data?.settings || null;
  const showChaiBadge = hostname.endsWith(".chaibuilder.site");
  const cookieConsentEnabled = settings?.cookieConsentEnabled || false;
  let page = null;
  try {
    page = await ChaiBuilder.getPage(slug);
    if ("error" in page) {
      return notFound();
    }
  } catch (err) {
    return notFound();
  }

  const { body, heading } = data.theme.fontFamily;
  const formattedBody = body.split(" ").join("_");
  const formattedHeading = heading.split(" ").join("_");
  const { fontStyles, preloads } = await getFontStyles(formattedHeading, formattedBody);

  //NOTE: pageProps are received in your dataProvider functions for block and page
  const pageProps: ChaiPageProps = {
    slug,
    pageType: page.pageType,
    fallbackLang: page.fallbackLang,
    pageLang: page.lang,
  };
  return (
    <html lang={page.lang} className={`smooth-scroll`}>
      <head>
        <ThemeScript />
        {preloads.map((preload: string, index: number) => (
          <link
            key={`preload-font-${index}`}
            rel="preload"
            href={preload}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <ChaiPageStyles page={page} />
        <style>{`:root {--font-body: "${body}", "${body} Fallback"; --font-heading: "${heading}", "${heading} Fallback";}`}</style>
        <style>{fontStyles}</style>
        {!isEmpty(settings?.headHTML) && <ChaiCustomHtml htmlHeadString={settings.headHTML} />}
      </head>
      <body className={`font-body antialiased`}>
        <ThemeProvider>
          <PreviewBanner slug={slug} show={isEnabled} />
          <RenderChaiBlocks page={page} pageProps={pageProps} imageComponent={ImageBlock} />
          {showChaiBadge && <ChaiBuilderBadge madeWithBadge={clientSettings?.madeWithBadge} />}
          <PageScripts />
          <Analytics />
          {cookieConsentEnabled && <CookieConsentWrapper lang={page.lang} settings={settings?.cookieConsentSettings} />}
        </ThemeProvider>
      </body>
    </html>
  );
}
