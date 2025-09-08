import { registerChaiSidebarPanel } from "@chaibuilder/sdk";
import { profilePanel, profilePanelId } from "./profile-panel";
export const registerChaiPanels = () => {
  setTimeout(() => {
    registerChaiSidebarPanel(profilePanelId, profilePanel);
  }, 300);
};
