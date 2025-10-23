import { registerChaiBlock } from "chai-next/blocks";
import dynamic from "next/dynamic";
import { BackgroundBeamsConfig } from "./background-beams";
import { BackgroundDiagonalConfig } from "./background-diagonal";
import { BackgroundGridConfig } from "./background-grid";
import { BackgroundLinesConfig } from "./background-lines";
import { FlipWordsConfig } from "./flip-words-block";
import { FollowingPointerConfig } from "./following-pointer";
import { FormConfig } from "./form-block-new";
import { PointerHighlightConfig } from "./pointer-highlight";
import { ResizeHandleConfig } from "./resize-handle-block";
import { SuspenseBlock, SuspenseConfig } from "./suspense";
import { TextHoverEffectConfig } from "./text-hover-effect";
import { TextRevealConfig } from "./text-reveal-block";
import { HeroVideoDialogConfig } from "./hero-video-dialog";

const ChaiForm = dynamic(() => import("./form-block-new")) as any;
const FlipWordsBlock = dynamic(() => import("./flip-words-block")) as any;
const ResizeHandleBlock = dynamic(() => import("./resize-handle-block")) as any;
const TextRevealBlock = dynamic(() => import("./text-reveal-block")) as any;
const BackgroundBeamsBlock = dynamic(() => import("./background-beams")) as any;
const BackgroundDiagonalBlock = dynamic(() => import("./background-diagonal")) as any;
const BackgroundGridBlock = dynamic(() => import("./background-grid")) as any;
const BackgroundLinesBlock = dynamic(() => import("./background-lines")) as any;
const FollowerPointerCardBlock = dynamic(() => import("./following-pointer")) as any;
const PointerHighlightBlock = dynamic(() => import("./pointer-highlight")) as any;
const TextHoverEffectBlock = dynamic(() => import("./text-hover-effect")) as any;
const HeroVideoDialogBlock = dynamic(() => import("./hero-video-dialog")) as any;

export const registerBlocks = () => {
  // Register the custom form block
  registerChaiBlock(ChaiForm, FormConfig);
  registerChaiBlock(FlipWordsBlock, FlipWordsConfig);
  registerChaiBlock(ResizeHandleBlock, ResizeHandleConfig);
  registerChaiBlock(SuspenseBlock, SuspenseConfig);
  registerChaiBlock(TextRevealBlock, TextRevealConfig);
  registerChaiBlock(BackgroundBeamsBlock, BackgroundBeamsConfig);
  registerChaiBlock(BackgroundDiagonalBlock, BackgroundDiagonalConfig);
  registerChaiBlock(BackgroundGridBlock, BackgroundGridConfig);
  registerChaiBlock(BackgroundLinesBlock, BackgroundLinesConfig);
  registerChaiBlock(FollowerPointerCardBlock, FollowingPointerConfig);
  registerChaiBlock(PointerHighlightBlock, PointerHighlightConfig);
  registerChaiBlock(TextHoverEffectBlock, TextHoverEffectConfig);
  registerChaiBlock(HeroVideoDialogBlock, HeroVideoDialogConfig);
};
