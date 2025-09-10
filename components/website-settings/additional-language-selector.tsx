"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface AdditionalLanguageSelectorProps {
  availableLanguages: Record<string, string>;
  defaultLanguage: string;
  additionalLanguages: string[];
  setAdditionalLanguages: (languages: string[]) => void;
}

export default function AdditionalLanguageSelector({
  availableLanguages,
  defaultLanguage,
  additionalLanguages,
  setAdditionalLanguages,
}: AdditionalLanguageSelectorProps) {
  const selectableLanguages = Object.entries(availableLanguages).filter(
    ([code]) => code !== defaultLanguage && !additionalLanguages.includes(code),
  );

  const handleLanguageAdd = (languageCode: string) => {
    if (additionalLanguages.length < 2 && !additionalLanguages.includes(languageCode)) {
      setAdditionalLanguages([...additionalLanguages, languageCode]);
    }
  };

  const handleLanguageRemove = (languageCode: string) => {
    setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageCode));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">
          Additional Languages <small className="text-muted-foreground">(Maximum 2)</small>
        </Label>

        {additionalLanguages.length < 2 && selectableLanguages.length > 0 ? (
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
        ) : additionalLanguages.length >= 2 ? (
          <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
            Maximum of 2 additional languages reached
          </div>
        ) : (
          <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">No more languages available</div>
        )}
      </div>

      {/* Selected Languages Badges */}
      {additionalLanguages.length > 0 && (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            {additionalLanguages.map((langCode) => (
              <Badge key={langCode} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {availableLanguages[langCode]}
                <button
                  type="button"
                  onClick={() => handleLanguageRemove(langCode)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
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
