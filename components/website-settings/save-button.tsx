"use client";

import { publishWebsiteSettings } from "@/actions/publish-website-settings-action";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { useReloadPage } from "chai-next";
import { Loader, Rocket, Save } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useSettingsContext } from ".";

interface SaveButtonProps {
  websiteId: string;
  hideSave?: boolean;
  hasChanges: boolean;
  type?: "button" | "submit";
  saveAction: () => Promise<any>;
  showPublish?: boolean;
  beforePublish?: () => boolean;
}

export default function SaveButton({
  websiteId,
  hasChanges,
  saveAction,
  beforePublish = () => true,
  showPublish = false,
  type = "submit",
}: SaveButtonProps) {
  const queryClient = useQueryClient();
  const reloadPage = useReloadPage();
  const { hasUnsavedChanges, setHasUnsavedChanges } = useSettingsContext();

  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  // * Save action
  const [, handleSave, isSaving] = useActionState(async () => {
    try {
      const result = await saveAction();
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
  const [, handlePublish, isPublishing] = useActionState(async () => {
    try {
      const shouldPublish = await beforePublish();
      if (!shouldPublish) return;
      const result = await publishWebsiteSettings(websiteId);
      if (result.success) {
        toast.success("Website settings published successfully!");
        queryClient.invalidateQueries({ queryKey: ["website-settings"] });
        reloadPage();
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
      {!showPublish && (
        <form action={handleSave}>
          <Button size="sm" type={type} className="w-36" disabled={isSaving || !hasChanges}>
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

      {showPublish && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <form action={handlePublish}>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="w-36 bg-green-500 text-white hover:bg-green-600"
                  disabled={isSaving || isPublishing || hasUnsavedChanges}>
                  {isPublishing ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      Publishing
                    </>
                  ) : (
                    <>
                      <Rocket className="h-3 w-3" />
                      Publish Settings
                    </>
                  )}
                </Button>
              </form>
            </TooltipTrigger>
            {hasUnsavedChanges && (
              <TooltipContent side="left">
                <p>To publish first save changes</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
