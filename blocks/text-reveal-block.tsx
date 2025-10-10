import TextRevealComponent from "@/components/ui/text-reveal-component";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";
import * as React from "react";

type TextRevealProps = {
  text: string;
  styles: ChaiStyles;
  duration: number;
  staggerDelay: number;
  className?: string;
};

const TextRevealBlock = (props: ChaiBlockComponentProps<TextRevealProps>) => {
  return <TextRevealComponent {...props} />;
};

const TextRevealConfig = {
  type: "TextReveal",
  label: "Text Reveal",
  category: "core",
  group: "typography",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("text-4xl font-bold"),
      text: {
        type: "string",
        title: "Text to Reveal",
        default: "Beautiful text reveal animation with smooth transitions",
      },
      duration: {
        type: "number",
        title: "Animation Duration (ms)",
        default: 800,
        minimum: 100,
        maximum: 3000,
      },
      staggerDelay: {
        type: "number",
        title: "Stagger Delay (ms)",
        default: 100,
        minimum: 10,
        maximum: 1000,
      },
    },
  }),
};

export { TextRevealConfig };
export default TextRevealBlock;
