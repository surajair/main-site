import { withBotId } from "botid/next/config";
import withChaiBuilder from "chai-next/config";
import { IMAGE_DOMAINS } from "./remote-pattern";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //NOTE: Update this list as needed
    remotePatterns: [...IMAGE_DOMAINS.map((domain) => ({ hostname: domain }))],
  },
  serverExternalPackages: ["sharp"],
};
export default withBotId(withChaiBuilder(nextConfig));
