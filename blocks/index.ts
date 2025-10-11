import { registerChaiBlock } from "chai-next/blocks";
import dynamic from "next/dynamic";
import { FlipWordsConfig } from "./flip-words-block";
import { FormConfig } from "./form-block-new";
import { ResizeHandleConfig } from "./resize-handle-block";
import { SuspenseBlock, SuspenseConfig } from "./suspense";
import { TextRevealConfig } from "./text-reveal-block";

const ChaiForm = dynamic(() => import("./form-block-new")) as any;
const FlipWordsBlock = dynamic(() => import("./flip-words-block")) as any;
const ResizeHandleBlock = dynamic(() => import("./resize-handle-block")) as any;
const TextRevealBlock = dynamic(() => import("./text-reveal-block")) as any;

export const registerBlocks = () => {
  // Register the custom form block
  registerChaiBlock(ChaiForm, FormConfig);
  registerChaiBlock(FlipWordsBlock, FlipWordsConfig);
  registerChaiBlock(ResizeHandleBlock, ResizeHandleConfig);
  registerChaiBlock(SuspenseBlock, SuspenseConfig);
  registerChaiBlock(TextRevealBlock, TextRevealConfig);
};
