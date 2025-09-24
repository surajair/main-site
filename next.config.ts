import { withBotId } from "botid/next/config";
import withChaiBuilder from "chai-next/config";
import { IMAGE_DOMAINS } from "./remote-pattern";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    //NOTE: Update this list as needed
    remotePatterns: [...IMAGE_DOMAINS.map((domain) => ({ hostname: domain }))],
  },
};
export default withBotId(withChaiBuilder(nextConfig));
