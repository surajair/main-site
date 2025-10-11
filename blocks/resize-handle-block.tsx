import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";
import ResizeHandleComponent from "./resize-handle-component";

type ResizeHandleProps = {
  words: string;
  duration: number;
  borderStyles: ChaiStyles;
  handleStyles: ChaiStyles;
  containerStyles: ChaiStyles;
  wordStyles: ChaiStyles;
};

const ResizeHandleBlock = (props: ChaiBlockComponentProps<ResizeHandleProps>) => {
  const words = props.words
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word !== "");
  return <ResizeHandleComponent {...props} words={words} />;
};

const ResizeHandleConfig = {
  type: "ResizeHandleFlipWords",
  label: "Resize-Handle Flip Words",
  category: "core",
  group: "typography",
  ...registerChaiBlockSchema({
    properties: {
      containerStyles: StylesProp("text-center inline-block"),
      borderStyles: StylesProp("border-2 border-border"),
      handleStyles: StylesProp("w-4 h-4 bg-background border-2 border-border rounded-md"),
      wordStyles: StylesProp("inline-block text-4xl h-fit font-bold"),
      words: {
        type: "string",
        title: "Words",
        default: "AWESOME, BEAUTIFUL, STUNNING, COOL, ELEGANT, AMAZING, VIBRANT, DYNAMIC",
        ui: { "ui:widget": "textarea", "ui:rows": 2, "ui:placeholder": "Enter comma separated words" },
      },
      duration: {
        type: "number",
        title: "Duration per Phrase (ms)",
        default: 2000,
        minimum: 1000,
        maximum: 10000,
      },
    },
  }),
};

export { ResizeHandleConfig };
export default ResizeHandleBlock;
