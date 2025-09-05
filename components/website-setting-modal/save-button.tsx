"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface SaveButtonProps {
  saving: boolean;
  hasChanges: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function SaveButton({ saving, hasChanges, onClick, type = "submit" }: SaveButtonProps) {
  return (
    <div className="flex justify-start">
      <Button type={type} className="px-10" disabled={saving || !hasChanges} onClick={onClick}>
        {saving ? (
          <>
            <Loader className="h-3 w-3 animate-spin" />
            Saving
          </>
        ) : (
          "Save"
        )}
      </Button>
    </div>
  );
}
