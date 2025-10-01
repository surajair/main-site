import { useShowUpgradeDialog, useUserPlan } from "@/lib/openfeature/helper";
import { Button } from "chai-next";
import { Crown } from "lucide-react";

export default function UpgradeModalButton({ children }: { children?: React.ReactNode }) {
  const plan = useUserPlan();
  const showUpgradeDialog = useShowUpgradeDialog();

  if (!plan?.isFree) return null;

  if (children) return <div onClick={() => showUpgradeDialog()}>{children}</div>;

  return (
    <Button type="button" size="sm" onClick={() => showUpgradeDialog()}>
      <Crown className="h-4 w-4" />
      Upgrade to Pro
    </Button>
  );
}
