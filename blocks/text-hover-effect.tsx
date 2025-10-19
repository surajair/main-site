import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type TextHoverEffectProps = {
  backgroundTextStyles: ChaiStyles;
  animatedTextStyles: ChaiStyles;
  gradientTextStyles: ChaiStyles;
  text: string;
  duration: number;
};

const TextHoverEffectBlock = (props: ChaiBlockComponentProps<TextHoverEffectProps>) => {
  return (
    <TextHoverEffect
      backgroundTextStyles={props.backgroundTextStyles}
      animatedTextStyles={props.animatedTextStyles}
      gradientTextStyles={props.gradientTextStyles}
      blockProps={props.blockProps}
      text={props.text}
      duration={props.duration}
    />
  );
};

const TextHoverEffectConfig = {
  type: "TextHoverEffect",
  label: "Text Hover Effect",
  category: "core",
  hidden: true,
  group: "text",
  ...registerChaiBlockSchema({
    properties: {
      backgroundTextStyles: StylesProp(
        "fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800",
      ),
      animatedTextStyles: StylesProp(
        "fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800",
      ),
      gradientTextStyles: StylesProp("fill-transparent font-[helvetica] text-7xl font-bold"),
      text: {
        type: "string",
        default: "Hover",
        title: "Text",
      },
      duration: {
        type: "number",
        default: 0,
        title: "Animation Duration",
      },
    },
  }),
  i18nProps: ["text"],
  canAcceptBlock: () => false,
};

export { TextHoverEffectConfig };
export default TextHoverEffectBlock;
