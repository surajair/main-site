import { useAiUsage } from "@/hooks/use-ai-usage";
import { BadgeDollarSign } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
export const aiUsagePanelId = "chai-ai-usage-panel";

const AiUsagePanelButton = () => {
  const [open, setOpen] = useState(false);
  const { totalCredit, usedCredit, remainingCredit, isCreditLeft } = useAiUsage();
  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={5000}>
      <TooltipContent side="left" className="bg-white border shadow-xl text-gray-800">
        <div className="flex flex-col min-w-28">
          <div className="font-bold text-xs pb-1">AI credit balance</div>
          {!isCreditLeft && (
            <div className="py-0.5 px-1 text-[11px] text-center rounded leading-tight border bg-red-500/10 border-red-300 text-red-500 mb-2">
              You are out of credits
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span>Total </span>
            <span className="font-semibold">{totalCredit.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Used </span>
            <span className="font-semibold">{usedCredit.toFixed(1)}</span>
          </div>
          <div className={`flex items-center justify-between text-xs ${remainingCredit < 5 ? "text-red-500" : ""}`}>
            <span>Remaining </span>
            <span className="font-semibold">{remainingCredit.toFixed(1)}</span>
          </div>
        </div>
      </TooltipContent>
      <TooltipTrigger asChild>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className={`w-11 -mx-1 h-max py-1 mb-2 flex items-center justify-center rounded cursor-pointer duration-200 ${remainingCredit < 4 ? "text-red-600 hover:bg-red-600/10" : "text-blue-600 hover:bg-blue-600/10"} ${remainingCredit > 99 ? "flex-col" : ""}`}>
          <BadgeDollarSign className="h-3 w-3 flex-shrink-0" size={12} />
          <small className="text-[11px] font-semibold pl-0.5">{remainingCredit.toFixed(1)?.replace(".0", "")}</small>
        </div>
      </TooltipTrigger>
    </Tooltip>
  );
};

const AiUsagePanelContent = () => {
  return <div>AI Usage</div>;
};

export const aiUsagePanel = {
  width: 400,
  label: "AI Usage",
  id: aiUsagePanelId,
  view: "modal" as const,
  button: AiUsagePanelButton,
  panel: AiUsagePanelContent,
  position: "bottom" as const,
};
