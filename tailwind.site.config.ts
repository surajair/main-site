import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import { getChaiBuilderTheme } from "chai-next/utils";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { CustomThemeConfig } from "tailwindcss/types/config";

const config: Config = {
  darkMode: "class",
  content: [
    "./blocks/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/chai-builder-badge.tsx",
    "./components/ui/**/*.{js,jsx,ts,tsx}",
    "./node_modules/chai-next/dist/blocks/**/*.{js,cjs}",
  ],
  safelist: ["w-[inherit]", "h-[inherit]", "aspect-video", "aspect-square", "aspect-auto"],
  theme: {
    extend: {
      ...(getChaiBuilderTheme() as Partial<CustomThemeConfig>),
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        meteor: {
          "0%": {
            transform: "rotate(215deg) translateX(0)",
            opacity: "1",
          },
          "70%": {
            opacity: "1",
          },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        meteor: "meteor 5s linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    aspectRatio,
    forms,
    plugin(function ({ addBase, theme }) {
      addBase({
        "h1,h2,h3,h4,h5,h6": {
          fontFamily: theme("fontFamily.heading"),
        },
        body: {
          fontFamily: theme("fontFamily.body"),
          color: theme("colors.foreground"),
          backgroundColor: theme("colors.background"),
        },
      });
    }),
    containerQueries,
  ],
};
export default config;
