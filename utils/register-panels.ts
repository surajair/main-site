import { formsPanel } from "@/components/website-settings/form-panel";
import { profilePanel } from "@/components/website-settings/profile-panel";
import { registerChaiSidebarPanel } from "@chaibuilder/sdk";

export const registerPanels = () => {
  registerChaiSidebarPanel("forms-panel", formsPanel);
  registerChaiSidebarPanel("user-info", profilePanel);
};
