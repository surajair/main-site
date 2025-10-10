import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";
import ResizeHandleComponent from "./resize-handle-component";

type ResizeHandleProps = {
  phrases: string[];
  duration: number;
  styles: ChaiStyles;
  borderStyles: ChaiStyles;
};

const ResizeHandleBlock = (props: ChaiBlockComponentProps<ResizeHandleProps>) => {
  return <ResizeHandleComponent {...props} />;
};

const ResizeHandleConfig = {
  type: "ResizeHandle",
  label: "Resize Handle Text",
  category: "core",
  group: "typography",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("text-4xl font-bold text-gray-800 dark:text-gray-200 border-2 "),
      borderStyles: StylesProp("border-2 border-blue-500 dark:border-blue-400 rounded-lg"),
      phrases: {
        type: "array",
        title: "Phrases",
        default: ["AWESOME", "BEAUTIFUL", "STUNNING", "COOL", "ELEGANT", "AMAZING", "VIBRANT", "DYNAMIC"],
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
        title: "Duration per Phrase (ms)",
        default: 3000,
        minimum: 1000,
        maximum: 10000,
      },
    },
  }),
};

export { ResizeHandleConfig };
export default ResizeHandleBlock;
