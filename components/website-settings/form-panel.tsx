import { Tooltip, TooltipContent, TooltipTrigger } from "chai-next";
import { BookOpenText } from "lucide-react";
import { Button } from "../ui/button";
import FormSubmissions from "./form-submissions";

const FormPanel = () => {
  return <FormSubmissions />;
};

const FormsButton = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  return (
    <Tooltip>
      <TooltipContent side="left">Form Submissions</TooltipContent>
      <TooltipTrigger asChild>
        <Button variant={isActive ? "outline" : "ghost"} onClick={show} size="icon" className="w-full mb-1">
          <BookOpenText size={16} className="h-7 w-7" />
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
};

// Forms Panel Configuration
export const formsPanel = {
  id: "forms-panel",
  label: "Forms Submissions",
  panel: FormPanel,
  button: FormsButton,
  position: "bottom" as const,
  width: 800,
  view: "modal" as const,
};
