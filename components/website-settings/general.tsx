"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LANGUAGE_CODES } from "@/lib/language-config";
import { useFeatureFlag } from "@/lib/openfeature/helper";
import { SiteData } from "@/utils/types";
import { useTranslation } from "chai-next";
import { useState } from "react";
import AdditionalLanguageSelector from "./additional-language-selector";

interface GeneralProps {
  data: SiteData;
  onChange: (updates: any) => void;
}

export default function General({ data, onChange }: GeneralProps) {
  const { t } = useTranslation();
  const { value: multilingualEnabled } = useFeatureFlag("multilingual");
  const [baseline, setBaseline] = useState(data);

  const handleChange = (updates: any) => {
    setBaseline((prev) => ({ ...(prev || data), ...updates }));
    onChange(updates);
  };

  return (
    <section id="general" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="siteName" className="text-xs">
          {t("Website name")}
        </Label>
        <Input
          placeholder={t("eg: My Website")}
          id="siteName"
          value={baseline?.settings?.siteName}
          onChange={(e) =>
            handleChange?.({
              ...(data || {}),
              name: e.target.value,
              settings: { ...(data?.settings || {}), siteName: e.target.value },
            })
          }
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="siteTagline" className="text-xs">
          {t("Tagline")}
        </Label>
        <Input
          placeholder={t("eg: The best website ever")}
          id="siteTagline"
          value={baseline?.settings?.siteTagline}
          onChange={(e) =>
            handleChange?.({
              ...(data || {}),
              settings: { ...(data?.settings || {}), siteTagline: e.target.value },
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Disable This Language Select and Show Only the Language which is not Editable */}
        <div className="space-y-1">
          <Label className="text-xs">
            {t("Default Language")} <small className="text-muted-foreground">({t("Cannot be changed")})</small>
          </Label>
          <Input
            className="bg-gray-100"
            value={LANGUAGE_CODES[data?.fallbackLang as keyof typeof LANGUAGE_CODES]}
            readOnly
          />
        </div>
        {multilingualEnabled && Object.keys(LANGUAGE_CODES).length > 1 && (
          <AdditionalLanguageSelector data={data} onChange={onChange} />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-4">
          <Switch
            id="darkMode"
            checked={baseline?.settings?.darkMode || false}
            onCheckedChange={(checked) =>
              handleChange?.({
                ...(data || {}),
                settings: { ...(data?.settings || {}), darkMode: checked },
              })
            }
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="darkMode" className="text-xs font-semibold">
              {t("Light & Dark Mode")}
            </Label>
            <p className="text-xs font-normal text-gray-500">
              {t(
                "Enables you to create your site in light and dark mode. If enabled, user will see their preferred device theme on first load.",
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
