import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";
import ShimmerButtonComponent from "./shimmer-button-component";

type ShimmerButtonProps = {
  text: string;
  shimmerColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  animationDuration: number;
  styles: ChaiStyles;
};

const ShimmerButtonBlock = (props: ChaiBlockComponentProps<ShimmerButtonProps>) => {
  return <ShimmerButtonComponent {...props} />;
};

const ShimmerButtonConfig = {
  type: "ShimmerButton",
  label: "Shimmer Button",
  category: "core",
  group: "basic",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      text: {
        type: "string",
        title: "Button Text",
        default: "Click Me",
        ui: {
          "ui:widget": "textarea",
          "ui:rows": 2,
        },
      },
      backgroundColor: {
        type: "string",
        title: "Background Color",
        default: "#000000",
        ui: { "ui:widget": "color" },
      },
      textColor: {
        type: "string",
        title: "Text Color",
        default: "#ffffff",
        ui: { "ui:widget": "color" },
      },
      shimmerColor: {
        type: "string",
        title: "Shimmer Color",
        default: "#06b6d4",
        ui: { "ui:widget": "color" },
      },
      borderRadius: {
        type: "string",
        title: "Border Radius",
        default: "9999px",
      },
      animationDuration: {
        type: "number",
        title: "Animation Duration (ms)",
        default: 2500,
        minimum: 500,
        maximum: 10000,
      },
    },
  }),
};

export { ShimmerButtonConfig };
export default ShimmerButtonBlock;
