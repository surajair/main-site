"use client";

import { publishWebsiteSettings } from "@/actions/publish-website-settings-action";
import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { SiteData } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useReloadPage } from "chai-next";
import { Loader, Rocket, Save } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

interface SaveButtonProps {
  websiteId: string;
  hideSave?: boolean;
  hasChanges: boolean;
  type?: "button" | "submit";
  data: SiteData;
  showPublish?: boolean;
}

export default function SaveButton({ websiteId, hasChanges, type = "submit", data }: SaveButtonProps) {
  const queryClient = useQueryClient();
  const reloadPage = useReloadPage();

  // * Save action
  const [, handleSave, isSaving] = useActionState(async () => {
    try {
      if (typeof data?.settings !== "object") return { success: false };
      const socialLinks = data?.settings?.socialLinks || {};
      Object.keys(socialLinks).forEach((link) => {
        if (socialLinks && !socialLinks[link]) {
          delete socialLinks[link];
        }
      });

      const updates: Partial<SiteData> = {
        name: data?.name,
        languages: data?.languages,
        settings: {
          ...data?.settings,
          socialLinks: socialLinks,
        },
      };

      console.log("##", updates);

      const result = await updateWebsiteData({ id: websiteId, updates: updates });
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
      const result = await publishWebsiteSettings(websiteId);
      if (result.success) {
        toast.success("Website settings published successfully!");
        queryClient.invalidateQueries({ queryKey: ["website-settings"] });
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
      <form action={handleSave}>
        <Button size="sm" type={type} className="w-40" disabled={isSaving || !hasChanges}>
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

      <form action={handlePublish}>
        <Button
          type="submit"
          variant="default"
          size="sm"
          className="w-40 bg-green-500 text-white hover:bg-green-600"
          disabled={isSaving || isPublishing}>
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
    </div>
  );
}
