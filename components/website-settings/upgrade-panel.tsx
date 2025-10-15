import { useUserPlan } from "@/lib/openfeature/helper";
import { Crown } from "lucide-react";
import UpgradeModalButton from "../upgrade/upgrade-modal-button";

const UpgradeButton = () => {
  const plan = useUserPlan();
  if (!plan?.isFree) return null;
  return (
    <UpgradeModalButton>
      <div className="w-11 -mx-1 h-9 mb-2 flex flex-col items-center bg-amber-100 justify-center text-amber-600 hover:text-primary hover:bg-primary/10 rounded cursor-pointer duration-200">
        <Crown className="h-4 w-4" />
        <small className="text-[8px] font-semibold">UPGRADE</small>
      </div>
    </UpgradeModalButton>
  );
};

// Upgrade Panel Configuration
export const upgradePanel = {
  id: "upgrade-modal",
  label: "Upgrade",
  panel: () => null,
  button: UpgradeButton,
  position: "bottom" as const,
  view: "modal" as const,
};
