"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useReloadPage } from "chai-next";
import { Loader, Rocket, Save } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

interface SaveButtonProps {
  hideSave?: boolean;
  hasChanges: boolean;
  type?: "button" | "submit";
  saveAction: (formData?: FormData) => Promise<any>;
}

export default function SaveButton({ hideSave = false, hasChanges, saveAction, type = "submit" }: SaveButtonProps) {
  const queryClient = useQueryClient();
  const reloadPage = useReloadPage();

  // * Save action
  const [, handleSave, isSaving] = useActionState(async (prevState: any, formData: FormData) => {
    try {
      const result = await saveAction(formData);
      if (result.success) {
        toast.success("Website settings updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["website-settings"] });
        reloadPage();
      } else {
        toast.error(result.error || "Failed to update website settings");
      }
      return result;
    } catch (error: any) {
      toast.error(error?.message || "Failed to update website settings");
      return { success: false, error: error?.message };
    }
  }, null);

  // * Publish action
  const [, handlePublish, isPublishing] = useActionState(async (prevState: any, formData: FormData) => {
    try {
      // If there are unsaved changes, save first
      if (hasChanges) {
        const saveResult = await saveAction(formData);
        if (!saveResult.success) {
          toast.error(saveResult.error || "Failed to save changes before publishing");
          return saveResult;
        }
        toast.success("Changes saved successfully!");
      }

      // Then publish
      const result = await Promise.resolve({ success: true, error: null });
      if (result.success) {
        toast.success("Website settings published successfully!");
      } else {
        toast.error(result.error || "Failed to publish website settings");
      }
      return result;
    } catch (error: any) {
      toast.error(error?.message || "Failed to publish website settings");
      return { success: false, error: error?.message };
    }
  }, null);

  return (
    <div className="flex justify-start gap-4">
      {!hideSave && (
        <form action={handleSave}>
          <Button size="sm" type={type} variant="outline" className="w-36" disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <>
                <Loader className="h-3 w-3 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                Save Draft
              </>
            )}
          </Button>
        </form>
      )}

      <form action={handlePublish}>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-36 bg-green-500 text-white hover:bg-green-600"
          disabled={isSaving || isPublishing}>
          {isPublishing ? (
            <>
              <Loader className="h-3 w-3 animate-spin" />
              Publishing
            </>
          ) : (
            <>
              <Rocket className="h-3 w-3" />
              Publish
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
