import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

type HeroVideoDialogProps = {
  styles: ChaiStyles;
  animationStyle: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  inBuilder: boolean;
};

const HeroVideoDialogBlock = (props: ChaiBlockComponentProps<HeroVideoDialogProps>) => {
  return (
    <HeroVideoDialog
      styles={props.styles}
      blockProps={props.blockProps}
      animationStyle={props.animationStyle}
      videoSrc={props.videoSrc}
      thumbnailSrc={props.thumbnailSrc}
      thumbnailAlt={props.thumbnailAlt}
      inBuilder={props.inBuilder}
    />
  );
};

const HeroVideoDialogConfig = {
  type: "HeroVideoDialog",
  label: "Hero Video Dialog",
  category: "core",
  group: "media",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("relative w-full h-full"),
      animationStyle: {
        type: "string",
        enum: [
          "from-bottom",
          "from-center",
          "from-top",
          "from-left",
          "from-right",
          "fade",
          "top-in-bottom-out",
          "left-in-right-out",
        ],
        enumNames: [
          "From Bottom",
          "From Center",
          "From Top",
          "From Left",
          "From Right",
          "Fade",
          "Top In Bottom Out",
          "Left In Right Out",
        ],
        default: "from-center",
        title: "Animation Style",
      },
      videoSrc: {
        type: "string",
        default: "",
        title: "Youtube URL",
      },
      thumbnailSrc: {
        type: "string",
        default: "",
        title: "Poster Image (Optional)",
        ui: { "ui:widget": "image" },
      },
      thumbnailAlt: {
        type: "string",
        default: "Video thumbnail",
        title: "Thumbnail Alt Text",
      },
    },
  }),
  i18nProps: ["thumbnailAlt", "videoSrc", "thumbnailSrc"],
  canAcceptBlock: () => false,
};

export { HeroVideoDialogConfig };
export default HeroVideoDialogBlock;
