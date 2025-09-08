import { profilePanel } from "@/components/website-settings/profile-panel";
import { registerChaiSidebarPanel } from "@chaibuilder/sdk";

export const registerPanels = () => {
  registerChaiSidebarPanel("user-info", profilePanel);
};
