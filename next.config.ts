import withChaiBuilder from 'chai-next/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    //NOTE: Update this list as needed
    remotePatterns: [
      { hostname: "ucarecdn.com" },
      { hostname: "placehold.co" },
      { hostname: "img.shields.io" },
      { hostname: "cdn.rareblocks.xyz" },
      { hostname: "picsum.photos" },
      { hostname: "fakeimg.pl" },
      { hostname: "via.placeholder.com" },
      { hostname: "fldwljgzcktqnysdkxnn.supabase.co" },
    ],
  },
};

export default withChaiBuilder(nextConfig)  ;
