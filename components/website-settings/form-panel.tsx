import { BookOpenText } from "lucide-react";
import { Button } from "../ui/button";
import FormSubmissions from "./form-submissions";

const FormPanel = () => {
  return <FormSubmissions />;
};

const FormsButton = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  return (
    <Button variant={isActive ? "default" : "ghost"} onClick={show} size="icon" className="w-full mb-1">
      <BookOpenText size={16} className="h-7 w-7" />
    </Button>
  );
};

// Forms Panel Configuration
export const formsPanel = {
  id: "forms-panel",
  label: "Forms",
  panel: FormPanel,
  button: FormsButton,
  position: "bottom" as const,
  width: 800,
  view: "modal" as const,
};
