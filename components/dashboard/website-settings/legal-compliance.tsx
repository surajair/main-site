"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSettingsContext } from "../website-setting-modal";
import SaveButton from "../website-setting-modal/save-button";

interface LegalComplianceProps {
  websiteId: string;
  initial?: {
    cookieConsentEnabled?: boolean;
    privacyPolicyURL?: string;
    termsURL?: string;
    recaptchaSiteKey?: string;
    recaptchaSecretKey?: string;
  };
}

export default function LegalCompliance({ websiteId, initial }: LegalComplianceProps) {
  const { setHasUnsavedChanges, onSaveSuccess } = useSettingsContext();

  const [cookieConsentEnabled, setCookieConsentEnabled] = useState<boolean>(initial?.cookieConsentEnabled ?? false);
  const [privacyPolicyURL, setPrivacyPolicyURL] = useState(initial?.privacyPolicyURL ?? "");
  const [termsURL, setTermsURL] = useState(initial?.termsURL ?? "");

  const [baseline, setBaseline] = useState({
    cookieConsentEnabled: initial?.cookieConsentEnabled ?? false,
    privacyPolicyURL: initial?.privacyPolicyURL ?? "",
    termsURL: initial?.termsURL ?? "",
  });
  const hasChanges =
    cookieConsentEnabled !== baseline.cookieConsentEnabled ||
    privacyPolicyURL !== baseline.privacyPolicyURL ||
    termsURL !== baseline.termsURL;

  // Update unsaved changes in context whenever hasChanges changes
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { cookieConsentEnabled, privacyPolicyURL, termsURL },
      });
      if (!res.success) throw new Error(res.error);
      toast.success("Legal & Compliance saved");
      setBaseline({
        cookieConsentEnabled,
        privacyPolicyURL,
        termsURL,
      });
      onSaveSuccess(); // Notify context that save was successful
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Legal & Compliance");
      return { success: false };
    }
  }, null);

  return (
    <section id="legal-compliance">
      <Card className="shadow-none border-none">
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="flex items-center  gap-4">
              <Switch
                id="cookieConsentEnabled"
                checked={cookieConsentEnabled}
                onCheckedChange={setCookieConsentEnabled}
              />
              <div>
                <Label htmlFor="cookieConsentEnabled" className="cursor-pointer">
                  Enable cookie consent panel
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacyPolicyURL">Privacy policy URL</Label>
              <Input
                id="privacyPolicyURL"
                value={privacyPolicyURL}
                placeholder="eg: https://example.com/privacy"
                onChange={(e) => setPrivacyPolicyURL(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="termsURL">Terms URL</Label>
              <Input
                placeholder="eg: https://example.com/terms"
                id="termsURL"
                value={termsURL}
                onChange={(e) => setTermsURL(e.target.value)}
              />
            </div>

            <SaveButton saving={saving} hasChanges={hasChanges} />
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
