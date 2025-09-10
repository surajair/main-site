import { BookOpenText } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import FormSubmissions from "./form-submissions";

const FormPanel = () => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="w-full mb-1">
              <BookOpenText size={16} className="h-7 w-7" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">Forms</TooltipContent>
      </Tooltip>
      <DialogContent className="max-w-6xl flex flex-col max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Form Submissions</DialogTitle>
        </DialogHeader>
        <FormSubmissions />
      </DialogContent>
    </Dialog>
  );
};

const FormsButton = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  return <FormPanel />;
};

// Forms Panel Configuration
export const formsPanel = {
  id: "forms-panel",
  label: "Forms",
  panel: FormPanel,
  button: FormsButton,
  position: "bottom" as const,
  width: 800,
  view: "standard" as const,
};
