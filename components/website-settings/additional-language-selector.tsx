"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGE_CODES } from "@/lib/language-config";
import { usePlanLimits } from "@/lib/openfeature/helper";
import { SiteData } from "@/utils/types";
import { X } from "lucide-react";
import { useState } from "react";

interface AdditionalLanguageSelectorProps {
  data: SiteData;
  onChange: (updates: any) => void;
}

export default function AdditionalLanguageSelector({ data, onChange }: AdditionalLanguageSelectorProps) {
  const defaultLanguage = data?.fallbackLang;
  const availableLanguages: Record<string, string> = LANGUAGE_CODES;
  const [addLangs, setAddLangs] = useState(data?.languages);
  const [initialLangs] = useState(data?.languages || []);
  const selectableLanguages = Object.entries(availableLanguages).filter(
    ([code]) => code !== defaultLanguage && !addLangs.includes(code),
  );
  const planLimit = usePlanLimits();
  const maxAdditionalLanguages = planLimit.getLimit("no_of_additional_languages");

  const handleLanguageAdd = (languageCode: string) => {
    const updatedLangs = [...addLangs, languageCode];
    const hasLanguageChanged = JSON.stringify(updatedLangs) !== JSON.stringify(initialLangs);
    setAddLangs(updatedLangs);
    onChange({
      languages: updatedLangs,
      ...(hasLanguageChanged && { isLanguageUpdate: true })
    });
  };

  const handleLanguageRemove = (languageCode: string) => {
    const updated = addLangs?.filter((lang) => lang !== languageCode);
    const hasLanguageChanged = JSON.stringify(updated || []) !== JSON.stringify(initialLangs);
    setAddLangs(updated);
    onChange({
      languages: updated || [],
      ...(hasLanguageChanged && { isLanguageUpdate: true })
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">
          Additional Languages <small className="text-muted-foreground">(Maximum {maxAdditionalLanguages})</small>
        </Label>

        {addLangs.length < maxAdditionalLanguages && selectableLanguages.length > 0 ? (
          <Select value="" onValueChange={handleLanguageAdd}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select additional language from here..." />
            </SelectTrigger>
            <SelectContent>
              {selectableLanguages.map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : addLangs.length >= maxAdditionalLanguages ? (
          <div className="text-sm text-muted-foreground  p-2 bg-muted border border-border rounded-md">
            Maximum of {maxAdditionalLanguages} additional languages limit reached
          </div>
        ) : (
          <div className="text-sm text-muted-foreground  p-2 bg-muted border border-border rounded-md">
            No more languages available
          </div>
        )}
      </div>

      {/* Selected Languages Badges */}
      {addLangs.length > 0 && (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            {addLangs.map((langCode) => (
              <Badge
                key={langCode}
                variant="secondary"
                className="border border-border flex items-center gap-1 pl-3 pr-1 py-1">
                {availableLanguages[langCode]}
                <button
                  type="button"
                  onClick={() => handleLanguageRemove(langCode)}
                  className="ml-1 hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${availableLanguages[langCode]}`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
