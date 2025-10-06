import { withBotId } from "botid/next/config";
import withChaiBuilder from "chai-next/config";
import type { NextConfig } from "next";
import { IMAGE_DOMAINS } from "./remote-pattern";

const nextConfig: NextConfig = {
  images: {
    //NOTE: Update this list as needed
    remotePatterns: [...IMAGE_DOMAINS.map((domain) => ({ hostname: domain }))],
  },
};
export default withBotId(withChaiBuilder(nextConfig));
