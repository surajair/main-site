import { formsPanel } from "@/components/website-settings/form-panel";
import { helpPanel } from "@/components/website-settings/help-panel";
import { profilePanel } from "@/components/website-settings/profile-panel";
import { upgradePanel } from "@/components/website-settings/upgrade-panel";
import { withGenAIPanel } from "@/components/website-settings/with-genai-panel";
import { registerChaiAddBlockTab } from "@chaibuilder/sdk";
import { registerChaiSidebarPanel } from "chai-next";

export const registerPanels = () => {
  registerChaiSidebarPanel("user-info", profilePanel);
  registerChaiSidebarPanel("help-panel", helpPanel);
  registerChaiSidebarPanel("forms-panel", formsPanel);
  registerChaiSidebarPanel("upgrade-modal", upgradePanel);

  // Register Chai Add Block Tab
  registerChaiAddBlockTab("with-genai", withGenAIPanel);
};
