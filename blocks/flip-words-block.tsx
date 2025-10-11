import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";
import FlipWordsComponent from "./flip-words-component";

type FlipWordsProps = {
  words: string;
  duration: number;
  styles: ChaiStyles;
};

const FlipWordsBlock = (props: ChaiBlockComponentProps<FlipWordsProps>) => {
  const splitWords = props.words
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word !== "");
  return <FlipWordsComponent {...props} words={splitWords} />;
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
        type: "string",
        title: "Words to Flip",
        default: "Lorem,Ipsum,Dolor,Sit,Amet",
        ui: { "ui:placeholder": "Enter comma separated words" },
      },
      duration: {
        type: "number",
        title: "Duration per Word (ms)",
        default: 2000,
        minimum: 1000,
        maximum: 10000,
      },
    },
  }),
  i18nProps: ["words"],
};

export { FlipWordsConfig };
export default FlipWordsBlock;
