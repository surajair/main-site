import { get } from "lodash";
import { Crown } from "lucide-react";
import UpgradeModal from "../dashboard/upgrade-modal";
import { useUser } from "./profile-panel";

const UpgradeButton = ({ show }: { show: () => void }) => {
  const { data } = useUser();
  const isFreePlan = get(data, "isFreePlan");
  if (!isFreePlan) return null;
  return (
    <div
      onClick={show}
      className="py-1 w-full flex flex-col items-center justify-center text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded cursor-pointer duration-200">
      <Crown className="h-4 w-4" />
      <small className="text-[8px] font-semibold">UPGRADE</small>
    </div>
  );
};

// Upgrade Panel Configuration
export const upgradePanel = {
  id: "upgrade-modal",
  label: "Upgrade",
  panel: UpgradeModal,
  button: UpgradeButton,
  position: "bottom" as const,
  width: 700,
  view: "modal" as const,
};
