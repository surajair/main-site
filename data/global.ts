import ChaiBuilder from "chai-next/server";

export const loadSiteGlobalData = async ({ lang }: { lang: string }) => {
  console.log("Site Id is:", ChaiBuilder.getSiteId());
  // Load
  return {
    siteName: "My Chai Site",
    siteDescription: "This is my Chai site description",
    id: ChaiBuilder.getSiteId(),
  };
};
