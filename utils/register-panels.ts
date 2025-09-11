import { formsPanel } from "@/components/website-settings/form-panel";
import { profilePanel } from "@/components/website-settings/profile-panel";
import { registerChaiSidebarPanel } from "chai-next";

export const registerPanels = () => {
  registerChaiSidebarPanel("user-info", profilePanel);
  registerChaiSidebarPanel("forms-panel", formsPanel);
};
