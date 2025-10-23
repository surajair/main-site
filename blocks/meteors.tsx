import { Meteors } from "@/components/ui/shadcn-io/meteors";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type MeteorsProps = {
  styles: ChaiStyles;
  number: number;
  minDelay: number;
  maxDelay: number;
  minDuration: number;
  maxDuration: number;
  angle: number;
};

const MeteorsBlock = (props: ChaiBlockComponentProps<MeteorsProps>) => {
  return (
    <div {...props.blockProps} {...props.styles}>
      <Meteors
        number={props.number}
        minDelay={props.minDelay}
        maxDelay={props.maxDelay}
        minDuration={props.minDuration}
        maxDuration={props.maxDuration}
        angle={props.angle}
      />
    </div>
  );
};

const MeteorsConfig = {
  type: "Meteors",
  label: "Meteors",
  category: "core",
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("absolute inset-0 -z-10 h-full w-full overflow-hidden"),
      number: {
        type: "number",
        default: 20,
        title: "Number of Meteors",
        minimum: 1,
        maximum: 100,
      },
      minDelay: {
        type: "number",
        default: 0.2,
        title: "Min Delay (seconds)",
        minimum: 0,
        maximum: 5,
        step: 0.1,
      },
      maxDelay: {
        type: "number",
        default: 1.2,
        title: "Max Delay (seconds)",
        minimum: 0,
        maximum: 10,
        step: 0.1,
      },
      minDuration: {
        type: "number",
        default: 2,
        title: "Min Duration (seconds)",
        minimum: 1,
        maximum: 10,
      },
      maxDuration: {
        type: "number",
        default: 10,
        title: "Max Duration (seconds)",
        minimum: 1,
        maximum: 20,
      },
      angle: {
        type: "number",
        default: 215,
        title: "Angle (degrees)",
        minimum: 0,
        maximum: 360,
      },
    },
  }),
  canAcceptBlock: () => false,
};

export { MeteorsConfig };
export default MeteorsBlock;
