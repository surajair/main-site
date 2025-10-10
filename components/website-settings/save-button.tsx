"use client";

import { publishWebsiteSettings } from "@/actions/publish-website-settings-action";
import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { SiteData } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation, useReloadPage } from "chai-next";
import { Loader, Rocket, Save } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

interface SaveButtonProps {
  websiteId: string;
  hasChanges: boolean;
  data: SiteData;
  showSave: boolean;
}

export default function SaveButton({ websiteId, hasChanges, data, showSave = true }: SaveButtonProps) {
  const { t } = useTranslation();
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
      const isLanguageUpdate = (data as any)?.isLanguageUpdate;

      const result = await updateWebsiteData({ id: websiteId, updates: updates });
      if (result.success) {
        toast.success(t("Website settings updated successfully!"));
        await queryClient.invalidateQueries({ queryKey: ["website-settings"] });
        if (isLanguageUpdate) {
          await queryClient.invalidateQueries({ queryKey: ["GET_WEBSITE_DRAFT_SETTINGS"] });
        }
        reloadPage();
      } else {
        toast.error(result.error || t("Failed to update website settings"));
      }
      return result;
    } catch (error: any) {
      toast.error(error?.message || t("Failed to update website settings"));
      return { success: false, error: error?.message };
    }
  }, null);

  // * Publish action
  const [, handlePublish, isPublishing] = useActionState(async () => {
    try {
      if (hasChanges) {
        await handleSave();
      }
      const result = await publishWebsiteSettings(websiteId);
      if (result.success) {
        toast.success(t("Website settings published successfully!"));
      } else {
        toast.error(result.error || t("Failed to publish website settings"));
      }
      return result;
    } catch (error: any) {
      toast.error(error?.message || t("Failed to publish website settings"));
      return { success: false, error: error?.message };
    }
  }, null);

  return (
    <div className="flex justify-start gap-4">
      {showSave && (
        <form action={handleSave}>
          <Button size="sm" className="w-40" type="submit" variant="default" disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <>
                <Loader className="h-3 w-3 animate-spin" />
                {t("Saving")}
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                {t("Save Draft")}
              </>
            )}
          </Button>
        </form>
      )}
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
              {t("Publishing")}
            </>
          ) : (
            <>
              <Rocket className="h-3 w-3" />
              {t("Publish Settings")}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
