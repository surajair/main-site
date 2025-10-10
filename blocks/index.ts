import { registerChaiBlock } from "chai-next/blocks";
import dynamic from "next/dynamic";
import { FormConfig } from "./form-block-new";
import { ShimmerButtonConfig } from "./shimmer-button-block";
import { SuspenseBlock, SuspenseConfig } from "./suspense";
import { TextRevealConfig } from "./text-reveal-block";

const ChaiForm = dynamic(() => import("./form-block-new")) as any;
const ShimmerButtonBlock = dynamic(() => import("./shimmer-button-block")) as any;
const TextRevealBlock = dynamic(() => import("./text-reveal-block")) as any;

export const registerBlocks = () => {
  // Register the custom form block
  registerChaiBlock(ChaiForm, FormConfig);
  registerChaiBlock(SuspenseBlock, SuspenseConfig);
  registerChaiBlock(TextRevealBlock, TextRevealConfig);
  registerChaiBlock(ShimmerButtonBlock, ShimmerButtonConfig);
};
