import { profilePanel, profilePanelId } from "@/components/website-settings/profile-panel";
import { registerChaiSidebarPanel } from "@chaibuilder/sdk";

export const registerChaiPanels = () => {
  setTimeout(() => {
    registerChaiSidebarPanel(profilePanelId, profilePanel);
  }, 300);
};
