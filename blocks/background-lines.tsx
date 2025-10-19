import { BackgroundLines } from "@/components/ui/background-lines";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type BackgroundLinesProps = {
  styles: ChaiStyles;
};

const BackgroundLinesBlock = (props: ChaiBlockComponentProps<BackgroundLinesProps>) => {
  return <BackgroundLines {...props}>{props.children}</BackgroundLines>;
};

const BackgroundLinesConfig = {
  type: "BackgroundLines",
  label: "Background Lines",
  category: "core",
  hidden: true,
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("h-[20rem] md:h-screen w-full"),
    },
  }),
  canAcceptBlock: () => true,
};

export { BackgroundLinesConfig };
export default BackgroundLinesBlock;
