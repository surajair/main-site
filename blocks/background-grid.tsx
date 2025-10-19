import GridBackground from "@/components/ui/background-grid";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type BackgroundGridProps = {
  styles: ChaiStyles;
  patternType: "grid" | "dots" | "grid-fade" | "dots-fade";
  gridSize: "sm" | "md" | "lg" | "xl";
  gridColor:
    | "gray"
    | "slate"
    | "zinc"
    | "neutral"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky";
};

const BackgroundGridBlock = (props: ChaiBlockComponentProps<BackgroundGridProps>) => {
  return (
    <GridBackground
      styles={props.styles}
      blockProps={props.blockProps}
      patternType={props.patternType}
      gridSize={props.gridSize}
      gridColor={props.gridColor}
    />
  );
};

const BackgroundGridConfig = {
  type: "BackgroundGrid",
  label: "Background Grid",
  category: "core",
  hidden: true,
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("absolute inset-0 -z-10 h-full w-full bg-white"),
      patternType: {
        type: "string",
        enum: ["grid", "dots", "grid-fade", "dots-fade"],
        default: "grid",
        title: "Pattern Type",
      },
      gridSize: {
        type: "string",
        enum: ["sm", "md", "lg", "xl"],
        default: "md",
        title: "Grid Size",
      },
      gridColor: {
        type: "string",
        enum: [
          "gray",
          "slate",
          "zinc",
          "neutral",
          "red",
          "orange",
          "amber",
          "yellow",
          "lime",
          "green",
          "emerald",
          "teal",
          "cyan",
          "sky",
        ],
        default: "gray",
        title: "Grid Color",
      },
    },
  }),
  canAcceptBlock: () => false,
};

export { BackgroundGridConfig };
export default BackgroundGridBlock;
