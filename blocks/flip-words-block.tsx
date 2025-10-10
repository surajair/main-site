import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";
import FlipWordsComponent from "./flip-words-component";

type FlipWordsProps = {
  words: string[];
  duration: number;
  styles: ChaiStyles;
};

const FlipWordsBlock = (props: ChaiBlockComponentProps<FlipWordsProps>) => {
  return <FlipWordsComponent {...props} />;
};

const FlipWordsConfig = {
  type: "FlipWords",
  label: "Flip Words",
  category: "core",
  group: "typography",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("text-4xl font-bold"),
      words: {
        type: "array",
        title: "Words to Flip",
        default: ["Amazing", "Beautiful", "Creative", "Dynamic"],
        items: {
          type: "string",
        },
        ui: {
          "ui:options": {
            orderable: true,
          },
        },
      },
      duration: {
        type: "number",
        title: "Duration per Word (ms)",
        default: 3000,
        minimum: 1000,
        maximum: 10000,
      },
    },
  }),
};

export { FlipWordsConfig };
export default FlipWordsBlock;
