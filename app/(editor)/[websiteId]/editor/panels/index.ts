import { profilePanel } from "@/components/website-settings/profile-panel";
import { registerChaiSidebarPanel } from "@chaibuilder/sdk";

export const registerChaiPanels = () => {
  setTimeout(() => {
    registerChaiSidebarPanel("user-info", profilePanel);
  }, 300);
};
