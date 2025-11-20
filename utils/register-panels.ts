import { aiPanel, aiPanelId } from "@/components/ai-panel/ai-panel";
import { aiUsagePanel, aiUsagePanelId } from "@/components/ai-panel/ai-usage-panel";
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

  const flags = localStorage.getItem("chai-feature-flags") ?? "";
  if (flags.includes("enable-ai-chat-panel")) {
    registerChaiSidebarPanel(aiPanelId, aiPanel);
    registerChaiSidebarPanel(aiUsagePanelId, aiUsagePanel);
  }
};
