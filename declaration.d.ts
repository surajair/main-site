import "chai-next";

declare module "chai-next" {
  interface ChaiPageProps {
    slug: string;
    pageType: string;
    fallbackLang: string;
  }
}
