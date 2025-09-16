import { registerChaiBlock } from "chai-next/blocks";
import { ChaiForm, FormConfig } from "./form-block-new";
import { SuspenseBlock, SuspenseConfig } from "./suspense";

export const registerBlocks = () => {
  // Register the custom form block
  registerChaiBlock(ChaiForm, FormConfig);
  registerChaiBlock(SuspenseBlock, SuspenseConfig);
};
