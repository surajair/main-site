"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSettingsContext } from ".";
import SaveButton from "./save-button";

interface SpamProtectionProps {
  websiteId: string;
  initial?: {
    recaptchaSiteKey?: string;
    recaptchaSecretKey?: string;
  };
}

export default function SpamProtection({ websiteId, initial }: SpamProtectionProps) {
  const { setHasUnsavedChanges } = useSettingsContext();
  const queryClient = useQueryClient();

  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(initial?.recaptchaSiteKey ?? "");
  const [recaptchaSecretKey, setRecaptchaSecretKey] = useState(initial?.recaptchaSecretKey ?? "");
  const [showRecaptchaSecretKey, setShowRecaptchaSecretKey] = useState(false);

  const [baseline, setBaseline] = useState({
    recaptchaSiteKey: initial?.recaptchaSiteKey ?? "",
    recaptchaSecretKey: initial?.recaptchaSecretKey ?? "",
  });

  const hasChanges =
    recaptchaSiteKey !== baseline.recaptchaSiteKey || recaptchaSecretKey !== baseline.recaptchaSecretKey;

  // Update unsaved changes in context whenever hasChanges changes
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { recaptchaSiteKey, recaptchaSecretKey },
      });
      if (!res.success) throw new Error(res.error);
      toast.success("Spam Protection saved");
      setBaseline({ recaptchaSiteKey, recaptchaSecretKey });
      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
      return { success: true } as const;
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Spam Protection");
      return { success: false } as const;
    }
  }, null);

  return (
    <section id="spam-protection">
      <form action={saveAll} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="recaptchaSiteKey" className="text-xs">
            ReCAPTCHA website key
          </Label>
          <Input
            id="recaptchaSiteKey"
            value={recaptchaSiteKey}
            placeholder="eg: XXXXXX"
            onChange={(e) => setRecaptchaSiteKey(e.target.value)}
          />
        </div>

        <div className="space-y-1 relative">
          <Label htmlFor="recaptchaSecretKey" className="text-xs">
            ReCAPTCHA secret key
          </Label>
          <Input
            id="recaptchaSecretKey"
            type={showRecaptchaSecretKey ? "text" : "password"}
            placeholder="eg: XXXXXX"
            value={recaptchaSecretKey}
            onChange={(e) => setRecaptchaSecretKey(e.target.value)}
          />
          {showRecaptchaSecretKey ? (
            <EyeIcon
              className="absolute right-3 top-1/2  w-4 h-4 cursor-pointer text-gray-500"
              onClick={() => setShowRecaptchaSecretKey(!showRecaptchaSecretKey)}
            />
          ) : (
            <EyeClosedIcon
              className="absolute right-3 top-1/2  w-4 h-4 cursor-pointer text-gray-500"
              onClick={() => setShowRecaptchaSecretKey(!showRecaptchaSecretKey)}
            />
          )}
        </div>

        <SaveButton saving={saving} hasChanges={hasChanges} />
      </form>
    </section>
  );
}
