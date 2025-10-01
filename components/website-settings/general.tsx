"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANGUAGE_CODES } from "@/lib/language-config";
import { useFeatureFlag } from "@/lib/openfeature/helper";
import { SiteData } from "@/utils/types";
import { useState } from "react";
import AdditionalLanguageSelector from "./additional-language-selector";

interface GeneralProps {
  data: SiteData;
  onChange: (updates: any) => void;
}

export default function General({ data, onChange }: GeneralProps) {
  const { value: multilingualEnabled } = useFeatureFlag("multilingual");
  const [baseline, setBaseline] = useState(data);

  const handleChange = (updates: any) => {
    setBaseline(updates);
    onChange(updates);
  };

  return (
    <section id="general" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="siteName" className="text-xs">
          Website name
        </Label>
        <Input
          placeholder="eg: My Website"
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
          Tagline
        </Label>
        <Input
          placeholder="eg: The best website ever"
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
            Default Language <small className="text-muted-foreground">(Cannot be changed)</small>
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
    </section>
  );
}
