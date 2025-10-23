import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type BackgroundBeamsProps = {
  styles: ChaiStyles;
  startColor: string;
  midColor: string;
  endColor: string;
};

const BackgroundBeamsBlock = (props: ChaiBlockComponentProps<BackgroundBeamsProps>) => {
  return (
    <div {...props.blockProps} {...props.styles}>
      <BackgroundBeams
        className={props.blockProps.className}
        startColor={props.startColor}
        midColor={props.midColor}
        endColor={props.endColor}
      />
    </div>
  );
};

const BackgroundBeamsConfig = {
  type: "BackgroundBeams",
  label: "Beams",
  category: "core",
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("absolute inset-0 -z-10 h-full w-full"),
    },
  }),
  canAcceptBlock: () => false,
};

export { BackgroundBeamsConfig };
export default BackgroundBeamsBlock;
