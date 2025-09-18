import { formsPanel } from "@/components/website-settings/form-panel";
import { profilePanel } from "@/components/website-settings/profile-panel";
import { upgradePanel } from "@/components/website-settings/upgrade-panel";
import { registerChaiSidebarPanel } from "chai-next";

export const registerPanels = () => {
  registerChaiSidebarPanel("upgrade-modal", upgradePanel);
  registerChaiSidebarPanel("user-info", profilePanel);
  registerChaiSidebarPanel("forms-panel", formsPanel);
};
