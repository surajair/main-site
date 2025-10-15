"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteData } from "@/utils/types";
import { useTranslation } from "chai-next";

interface LegalComplianceProps {
  data: SiteData;
  onChange?: (updates: any) => void;
}

export default function LegalCompliance({ data, onChange }: LegalComplianceProps) {
  const { t } = useTranslation();
  const cookieConsentEnabled = data?.settings?.cookieConsentEnabled || false;
  const cookieSettings = data?.settings?.cookieConsentSettings || {
    consentModal: {
      layout: "cloud",
      position: "bottom right",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  };

  const updateCookieSettings = (path: string, value: any) => {
    const [modal, field] = path.split(".");
    onChange?.({
      settings: {
        cookieConsentSettings: {
          ...cookieSettings,
          [modal]: {
            ...cookieSettings[modal as keyof typeof cookieSettings],
            [field]: value,
          },
        },
      },
    });
  };

  return (
    <section id="legal-compliance" className="space-y-4">
      <div className="flex items-center gap-4">
        <Switch
          id="cookieConsentEnabled"
          checked={cookieConsentEnabled}
          onCheckedChange={(checked) =>
            onChange?.({
              settings: {
                cookieConsentEnabled: checked,
              },
            })
          }
        />
        <div>
          <Label htmlFor="cookieConsentEnabled" className="cursor-pointer text-xs font-semibold">
            {t("Enable cookie consent panel")}
          </Label>
        </div>
      </div>

      {cookieConsentEnabled && (
        <div className="space-y-6 rounded-lg border bg-muted/30 p-4">
          {/* Consent Modal Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t("Consent Modal Settings")}</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">{t("Layout")}</Label>
                <Select
                  value={cookieSettings.consentModal.layout}
                  onValueChange={(value) => updateCookieSettings("consentModal.layout", value)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">{t("Position")}</Label>
                <Select
                  value={cookieSettings.consentModal.position}
                  onValueChange={(value) => updateCookieSettings("consentModal.position", value)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top left">Top Left</SelectItem>
                    <SelectItem value="top center">Top Center</SelectItem>
                    <SelectItem value="top right">Top Right</SelectItem>
                    <SelectItem value="middle left">Middle Left</SelectItem>
                    <SelectItem value="middle center">Middle Center</SelectItem>
                    <SelectItem value="middle right">Middle Right</SelectItem>
                    <SelectItem value="bottom left">Bottom Left</SelectItem>
                    <SelectItem value="bottom center">Bottom Center</SelectItem>
                    <SelectItem value="bottom right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Switch
                  id="consent-equal-weight"
                  checked={cookieSettings.consentModal.equalWeightButtons}
                  onCheckedChange={(checked) => updateCookieSettings("consentModal.equalWeightButtons", checked)}
                />
                <Label htmlFor="consent-equal-weight" className="cursor-pointer text-xs">
                  {t("Equal weight buttons")}
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="consent-flip"
                  checked={cookieSettings.consentModal.flipButtons}
                  onCheckedChange={(checked) => updateCookieSettings("consentModal.flipButtons", checked)}
                />
                <Label htmlFor="consent-flip" className="cursor-pointer text-xs">
                  {t("Flip buttons")}
                </Label>
              </div>
            </div>
          </div>

          {/* Preferences Modal Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t("Preferences Modal Settings")}</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">{t("Layout")}</Label>
                <Select
                  value={cookieSettings.preferencesModal.layout}
                  onValueChange={(value) => updateCookieSettings("preferencesModal.layout", value)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">{t("Position")}</Label>
                <Select
                  value={cookieSettings.preferencesModal.position}
                  onValueChange={(value) => updateCookieSettings("preferencesModal.position", value)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Switch
                  id="preferences-equal-weight"
                  checked={cookieSettings.preferencesModal.equalWeightButtons}
                  onCheckedChange={(checked) => updateCookieSettings("preferencesModal.equalWeightButtons", checked)}
                />
                <Label htmlFor="preferences-equal-weight" className="cursor-pointer text-xs">
                  {t("Equal weight buttons")}
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="preferences-flip"
                  checked={cookieSettings.preferencesModal.flipButtons}
                  onCheckedChange={(checked) => updateCookieSettings("preferencesModal.flipButtons", checked)}
                />
                <Label htmlFor="preferences-flip" className="cursor-pointer text-xs">
                  {t("Flip buttons")}
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
