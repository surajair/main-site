import { registerChaiBlock } from "chai-next/blocks";
import { ChaiForm, FormConfig } from "./form-block-new";

export const registerBlocks = () => {
  // Register the custom form block
  registerChaiBlock(ChaiForm, FormConfig);
};
