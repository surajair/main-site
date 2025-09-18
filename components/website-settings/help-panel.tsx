import { TooltipTrigger } from "chai-next";
import { HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { SupportPanel } from "./support";

const HelpButton = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  return (
    <Tooltip>
      <TooltipContent side="left">Help</TooltipContent>
      <TooltipTrigger asChild>
        <Button variant={isActive ? "default" : "ghost"} onClick={show} size="icon" className="w-full mb-2">
          <HelpCircle size={18} className="h-7 w-7" />
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
};

export const helpPanel = {
  id: "help-panel",
  label: "Help",
  panel: SupportPanel,
  button: HelpButton,
  position: "bottom" as const,
  width: 280,
  view: "standard" as const,
};
