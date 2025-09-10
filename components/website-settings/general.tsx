"use client";

import { updateSite, updateWebsiteName } from "@/actions/update-site-action";
import { updateWebsiteData } from "@/actions/update-website-setting";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANGUAGE_CODES } from "@/lib/language-config";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingsContext } from ".";
import SaveButton from "./save-button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReloadPage } from "chai-next";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import AdditionalLanguageSelector from "./additional-language-selector";

interface GeneralProps {
  websiteId: string;
  initial?: {
    siteName?: string;
    siteTagline?: string;
    language?: string;
    timezone?: string;
    additionalLanguages?: string[];
  };
  siteData?: {
    languages?: string[];
  };
}

// const timeZones = Intl.supportedValuesOf("timeZone");

export default function General({ websiteId, initial, siteData }: GeneralProps) {
  const { setHasUnsavedChanges } = useSettingsContext();
  const queryClient = useQueryClient();
  const reloadPage = useReloadPage();
  const [siteName, setSiteName] = useState(initial?.siteName ?? "");
  const [siteTagline, setSiteTagline] = useState(initial?.siteTagline ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "en");
  const [timezone, setTimezone] = useState(initial?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>(siteData?.languages ?? []);

  const [baseline, setBaseline] = useState({
    siteName: initial?.siteName ?? "",
    siteTagline: initial?.siteTagline ?? "",
    language: initial?.language ?? "en",
    timezone: initial?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    additionalLanguages: siteData?.languages ?? [],
  });

  const hasChanges =
    siteName !== baseline.siteName ||
    siteTagline !== baseline.siteTagline ||
    language !== baseline.language ||
    timezone !== baseline.timezone ||
    JSON.stringify(additionalLanguages.sort()) !== JSON.stringify(baseline.additionalLanguages.sort());

  // Update unsaved changes in context whenever hasChanges changes
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      // Update website name through the dedicated function
      if (siteName !== baseline.siteName) {
        const nameResult = await updateWebsiteName(websiteId, siteName);
        if (!nameResult.success) throw new Error(nameResult.error);
      }

      // Update other settings through website data
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { siteTagline, language, timezone },
      });
      if (!res.success) throw new Error(res.error);

      // Update additional languages using updateSite
      const languagesResult = await updateSite(websiteId, {
        languages: additionalLanguages,
      });
      if (!languagesResult.success) throw new Error(languagesResult.error);

      reloadPage();
      toast.success("General settings saved");
      setBaseline({ siteName, siteTagline, language, timezone, additionalLanguages });
      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save general settings");
      return { success: false };
    }
  }, null);

  return (
    <section id="general">
      <form action={saveAll} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="siteName" className="text-xs">
            Website name
          </Label>
          <Input
            placeholder="eg: My Website"
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="siteTagline" className="text-xs">
            Tagline
          </Label>
          <Input
            placeholder="eg: The best website ever"
            id="siteTagline"
            value={siteTagline}
            onChange={(e) => setSiteTagline(e.target.value)}
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
              id={language}
              value={LANGUAGE_CODES[language as keyof typeof LANGUAGE_CODES]}
              readOnly
            />
          </div>
          <AdditionalLanguageSelector
            availableLanguages={LANGUAGE_CODES}
            defaultLanguage={language}
            additionalLanguages={additionalLanguages}
            setAdditionalLanguages={setAdditionalLanguages}
          />
          {/* TODO: Need to handle this later for Now we  are Hiding this */}
          {/* <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={(v) => setTimezone(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
        </div>

        <SaveButton saving={saving} hasChanges={hasChanges} />
      </form>
    </section>
  );
}
