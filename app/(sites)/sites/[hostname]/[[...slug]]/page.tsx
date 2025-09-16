import { registerBlocks } from "@/blocks";
import { ImageBlock } from "@/components/image";
import { PageScripts } from "@/components/page-scripts";
import { loadSiteGlobalData } from "@/data/global";
import { getBrandConfig } from "@/lib/utils";
import { ChaiPageProps, loadWebBlocks } from "chai-next/blocks";
import { FontsAndStyles, PreviewBanner, RenderChaiBlocks } from "chai-next/blocks/rsc";
import ChaiBuilder, { registerChaiGlobalDataProvider } from "chai-next/server";
import { Roboto } from "next/font/google";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

const roboto = Roboto({ subsets: ["latin"] });

loadWebBlocks();
registerBlocks();
registerChaiGlobalDataProvider(loadSiteGlobalData);

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
  let page = null;
  try {
    page = await ChaiBuilder.getPage(slug);
    if ("error" in page) {
      return notFound();
    }
  } catch (err) {
    return notFound();
  }

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
        {settings?.headHTML && (
          <div dangerouslySetInnerHTML={{ __html: settings.headHTML }} style={{ display: "contents" }} />
        )}
      </head>
      <body className={`${roboto.className} antialiased`}>
        <PreviewBanner slug={slug} show={isEnabled} />
        <RenderChaiBlocks page={page} pageProps={pageProps} imageComponent={ImageBlock} />
        <PageScripts />
      </body>
    </html>
  );
}
