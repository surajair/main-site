import DiagonalStripesBackground from "@/components/ui/background-diagonal";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type BackgroundDiagonalProps = {
  styles: ChaiStyles;
  angle: 45 | 135 | 225 | 315;
  stripeColor:
    | "gray"
    | "slate"
    | "zinc"
    | "neutral"
    | "blue"
    | "purple"
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
  stripeWidth: "thin" | "normal" | "thick";
  spacing: "tight" | "normal" | "loose";
  fixed: boolean;
};

const BackgroundDiagonalBlock = (props: ChaiBlockComponentProps<BackgroundDiagonalProps>) => {
  return (
    <DiagonalStripesBackground
      styles={props.styles}
      blockProps={props.blockProps}
      angle={props.angle}
      stripeColor={props.stripeColor}
      stripeWidth={props.stripeWidth}
      spacing={props.spacing}
      fixed={props.fixed}
    />
  );
};

const BackgroundDiagonalConfig = {
  type: "BackgroundDiagonal",
  label: "Diagonal Stripes",
  category: "core",
  hidden: true,
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("absolute inset-0 -z-10 h-full w-full"),
      angle: {
        type: "number",
        enum: [45, 135, 225, 315],
        default: 45,
        title: "Angle",
      },
      stripeColor: {
        type: "string",
        enum: [
          "gray",
          "slate",
          "zinc",
          "neutral",
          "blue",
          "purple",
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
        title: "Stripe Color",
      },
      stripeWidth: {
        type: "string",
        enum: ["thin", "normal", "thick"],
        default: "thin",
        title: "Stripe Width",
      },
      spacing: {
        type: "string",
        enum: ["tight", "normal", "loose"],
        default: "normal",
        title: "Spacing",
      },
      fixed: {
        type: "boolean",
        default: false,
        title: "Fixed Background",
      },
    },
  }),
  canAcceptBlock: () => false,
};

export { BackgroundDiagonalConfig };
export default BackgroundDiagonalBlock;
