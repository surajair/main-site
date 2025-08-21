import {
  ChaiFontViaSrc,
  ChaiFontViaUrl,
  registerChaiFont,
} from "chai-next/blocks";

export const registerFonts = () => {
  // Google font
  registerChaiFont("Ubuntu", {
    url: "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap",
    fallback: `sans-serif`,
  } as ChaiFontViaUrl);

  // Custom font files
  registerChaiFont("Geist", {
    fallback: `"Geist Fallback", Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`,
    src: [
      {
        url: "https://vercel.com/vc-ap-vercel-docs/_next/static/media/93f479601ee12b01.p.woff2",
        format: "woff2",
      },
      {
        url: "https://vercel.com/vc-ap-vercel-docs/_next/static/media/569ce4b8f30dc480-s.p.woff2",
        format: "woff2",
      },
    ],
  } as ChaiFontViaSrc);
};
