import { getChaiBuilderTheme } from "chai-next/utils";
import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";
import { CustomThemeConfig } from "tailwindcss/types/config";

const config: Config = {
  darkMode: "class",
  content: [
    "./blocks/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/chai-next/dist/blocks/**/*.{js,cjs}"
  ],
  safelist: ["w-[inherit]", "h-[inherit]"],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    typography,
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
    animate,
    containerQueries,
  ],
};
export default config;
