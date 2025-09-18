import { formsPanel } from "@/components/website-settings/form-panel";
import { helpPanel } from "@/components/website-settings/help-panel";
import { profilePanel } from "@/components/website-settings/profile-panel";
import { upgradePanel } from "@/components/website-settings/upgrade-panel";
import { registerChaiSidebarPanel } from "chai-next";

export const registerPanels = () => {
  registerChaiSidebarPanel("user-info", profilePanel);
  registerChaiSidebarPanel("help-panel", helpPanel);
  registerChaiSidebarPanel("forms-panel", formsPanel);
  registerChaiSidebarPanel("upgrade-modal", upgradePanel);
};
