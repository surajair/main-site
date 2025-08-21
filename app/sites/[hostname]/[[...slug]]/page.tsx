import { ChaiPageProps, loadWebBlocks } from "chai-next/blocks";
import { FontsAndStyles, PreviewBanner, RenderChaiBlocks } from "chai-next/blocks/rsc";
import ChaiBuilder from "chai-next/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

loadWebBlocks();

export const dynamic = "force-static"; // Remove this if you want to use ssr mode

export const generateMetadata = async (props: {
  params: Promise<{ slug: string[] }>;
}) => {
  const nextParams = await props.params;
  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";
  return await ChaiBuilder.getPageSeoData(slug);
};

export default async function Page({
  params,
}: {
  params: Promise<{ hostname: string; slug: string[] }>;
}) {
  const nextParams = await params;
  await ChaiBuilder.initByHostname(nextParams.hostname);

  const { isEnabled } = await draftMode();
  await ChaiBuilder.loadSiteSettings(isEnabled);

  const slug = nextParams.slug ? `/${nextParams.slug.join("/")}` : "/";

  const page = await ChaiBuilder.getPage(slug);
  if ("error" in page) {
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
    <>
      <FontsAndStyles />
      <PreviewBanner slug={slug} show={isEnabled} />
      <RenderChaiBlocks page={page} pageProps={pageProps} />
    </>
  );
}
