import { MagicCard } from "@/components/ui/magic-card";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type MagicCardProps = {
  gradientSize: number;
  gradientColor: string;
  gradientOpacity: number;
  gradientFrom: string;
  gradientTo: string;
  styles: ChaiStyles;
};

const MagicCardBlock = (props: ChaiBlockComponentProps<MagicCardProps>) => {
  return (
    <div {...props.blockProps} {...props.styles}>
      <MagicCard
        gradientSize={props.gradientSize}
        gradientColor={props.gradientColor}
        gradientOpacity={props.gradientOpacity}
        gradientFrom={props.gradientFrom}
        gradientTo={props.gradientTo}>
        {props.children}
      </MagicCard>
    </div>
  );
};

const MagicCardConfig = {
  type: "MagicCard",
  label: "Magic Card",
  category: "core",
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("group relative rounded-[inherit]"),
      gradientSize: {
        type: "number",
        default: 200,
        title: "Gradient Size",
      },
      gradientColor: {
        type: "string",
        default: "#9E7AFF",
        title: "Gradient Color",
        ui: { "ui:widget": "color" },
      },
      gradientOpacity: {
        type: "number",
        default: 0.8,
        title: "Gradient Opacity",
      },
      gradientFrom: {
        type: "string",
        default: "#9E7AFF",
        title: "Gradient From Color",
        ui: { "ui:widget": "color" },
      },
      gradientTo: {
        type: "string",
        default: "#FE8BBB",
        title: "Gradient To Color",
        ui: { "ui:widget": "color" },
      },
    },
  }),
  canAcceptBlock: () => true,
};

export { MagicCardConfig };
export default MagicCardBlock;
