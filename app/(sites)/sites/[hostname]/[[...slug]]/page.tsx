import { registerBlocks } from "@/blocks";
import ChaiBuilderBadge from "@/components/chai-builder-badge";
import { ImageBlock } from "@/components/image";
import { PageScripts } from "@/components/page-scripts";
import { loadSiteGlobalData } from "@/data/global";
import { getFontStyles, registerFonts } from "@/fonts";
import { getBrandConfig } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { ChaiPageProps, loadWebBlocks } from "chai-next/blocks";
import { FontsAndStyles, PreviewBanner, RenderChaiBlocks } from "chai-next/blocks/rsc";
import ChaiBuilder, { registerChaiGlobalDataProvider } from "chai-next/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

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
  const brandConfig = getBrandConfig();
  const favicon = data?.settings?.faviconURL || brandConfig.favicon || "/favicon.ico";
  return { ...((await ChaiBuilder.getPageSeoData(slug)) as any), icons: { icon: favicon } };
};

export default async function Page({ params }: { params: Promise<{ hostname: string; slug: string[] }> }) {
  const nextParams = await params;
  const hostname = nextParams.hostname.replace("%3A", ":").replace("%2E", ".");
  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";
  const { isEnabled } = await draftMode();
  await ChaiBuilder.initByHostname(hostname, isEnabled);
  const data = await ChaiBuilder.getSiteSettings();
  const settings = data?.settings || null;
  const showChaiBadge = hostname.endsWith(".chaibuilder.site");
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
  const fontStyles = await getFontStyles("Lavishly_Yours", body);
  console.log("fontStyles", fontStyles);

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
        <FontsAndStyles page={page} googleFonts={false} />
        <style>{fontStyles}</style>
        {settings?.headHTML && (
          <div dangerouslySetInnerHTML={{ __html: settings.headHTML }} style={{ display: "contents" }} />
        )}
      </head>
      <body className={`font-body antialiased`}>
        <PreviewBanner slug={slug} show={isEnabled} />
        <RenderChaiBlocks page={page} pageProps={pageProps} imageComponent={ImageBlock} />
        {showChaiBadge && <ChaiBuilderBadge />}
        <PageScripts />
        {!isEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
