import { registerChaiGlobalDataProvider } from "chai-next/server";
import { cache } from "react";

const globalDataProvider = cache(async ({ lang }: { lang: string }) => {
  console.log("lang", lang);
  return {
    name: "Chai Builder",
    address: "Pune, Maharashtra, India",
    email: "support@chaibuilder.com",
    social: {
      facebook: "https://www.facebook.com/chaibuilder",
      instagram: "https://www.instagram.com/chaibuilder",
      x: "https://x.com/chaibuilder",
    },
  };
});

registerChaiGlobalDataProvider(globalDataProvider);
