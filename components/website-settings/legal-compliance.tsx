"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SiteData } from "@/utils/types";

interface LegalComplianceProps {
  data: SiteData;
  onChange?: (updates: any) => void;
}

export default function LegalCompliance({ data, onChange }: LegalComplianceProps) {
  return (
    <section id="legal-compliance" className="space-y-4">
      <div className="flex items-center gap-4">
        <Switch
          id="cookieConsentEnabled"
          checked={data?.settings?.cookieConsentEnabled || false}
          onCheckedChange={(checked) =>
            onChange?.({
              settings: {
                cookieConsentEnabled: checked,
              },
            })
          }
        />
        <div>
          <Label htmlFor="cookieConsentEnabled" className="cursor-pointer text-xs">
            Enable cookie consent panel
          </Label>
        </div>
      </div>
    </section>
  );
}
