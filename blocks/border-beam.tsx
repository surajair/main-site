import { BorderBeam } from "@/components/ui/border-beam";
import { ChaiBlockComponentProps, registerChaiBlockSchema } from "chai-next/blocks";

type BorderBeamProps = {
  size: number;
  duration: number;
  delay: number;
  colorFrom: string;
  colorTo: string;
  reverse: boolean;
  initialOffset: number;
  borderWidth: number;
};

const BorderBeamBlock = (props: ChaiBlockComponentProps<BorderBeamProps>) => {
  return (
    <BorderBeam
      size={props.size}
      duration={props.duration}
      delay={props.delay}
      colorFrom={props.colorFrom}
      colorTo={props.colorTo}
      reverse={props.reverse}
      initialOffset={props.initialOffset}
      borderWidth={props.borderWidth}
    />
  );
};

const BorderBeamConfig = {
  type: "BorderBeam",
  label: "Border Beam",
  category: "core",
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      size: {
        type: "number",
        default: 50,
        title: "Beam Size",
      },
      duration: {
        type: "number",
        default: 6,
        title: "Animation Duration (seconds)",
      },
      delay: {
        type: "number",
        default: 0,
        title: "Animation Delay (seconds)",
      },
      colorFrom: {
        type: "string",
        default: "#ffaa40",
        title: "Start Color",
        ui: { "ui:widget": "color" },
      },
      colorTo: {
        type: "string",
        default: "#9c40ff",
        title: "End Color",
        ui: { "ui:widget": "color" },
      },
      reverse: {
        type: "boolean",
        default: false,
        title: "Reverse Animation",
      },
      initialOffset: {
        type: "number",
        default: 0,
        title: "Initial Offset (%)",
      },
      borderWidth: {
        type: "number",
        default: 1,
        title: "Border Width (px)",
      },
    },
  }),
  canAcceptBlock: () => true,
};

export { BorderBeamConfig };
export default BorderBeamBlock;
