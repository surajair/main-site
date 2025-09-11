"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import SaveButton from "./save-button";

interface LegalComplianceProps {
  websiteId: string;
  initial?: {
    cookieConsentEnabled?: boolean;
    recaptchaSiteKey?: string;
    recaptchaSecretKey?: string;
  };
}

export default function LegalCompliance({ websiteId, initial }: LegalComplianceProps) {

  const [cookieConsentEnabled, setCookieConsentEnabled] = useState<boolean>(initial?.cookieConsentEnabled ?? false);

  const [baseline, setBaseline] = useState({
    cookieConsentEnabled: initial?.cookieConsentEnabled ?? false,
  });
  const hasChanges = cookieConsentEnabled !== baseline.cookieConsentEnabled;

  const saveAction = async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { cookieConsentEnabled },
      });
      if (!res.success) throw new Error(res.error);
      setBaseline({
        cookieConsentEnabled,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to save Cookie Consent" };
    }
  };

  return (
    <section id="legal-compliance" className="space-y-4">
      <div className="flex items-center  gap-4">
        <Switch id="cookieConsentEnabled" checked={cookieConsentEnabled} onCheckedChange={setCookieConsentEnabled} />
        <div>
          <Label htmlFor="cookieConsentEnabled" className="cursor-pointer text-xs">
            Enable cookie consent panel
          </Label>
        </div>
      </div>

      <SaveButton websiteId={websiteId} hasChanges={hasChanges} saveAction={saveAction} />
    </section>
  );
}
