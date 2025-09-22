import { ChaiFontViaSrc, ChaiFontViaUrl, registerChaiFont } from "chai-next/blocks";
import { fontsMap } from "./fonts-map";

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
        url: "/fonts/geist/8a480f0b521d4e75-s.8e0177b5.woff2",
        format: "woff2",
      },
      {
        url: "/fonts/geist/7178b3e590c64307-s.b97b3418.woff2",
        format: "woff2",
      },
      {
        url: "/fonts/geist/caa3a2e1cccd8315-s.p.853070df.woff2",
        format: "woff2",
      },
    ],
  } as ChaiFontViaSrc);
};

export const getFontStyles = async (headingFont: string, bodyFont: string) => {
  let fonts = fontsMap[headingFont] ?? "";
  if (headingFont !== bodyFont) {
    fonts += fontsMap[bodyFont] ?? "";
  }
  return fonts;
};
