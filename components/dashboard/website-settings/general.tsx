"use client";

import { updateWebsiteName } from "@/actions/update-site-action";
import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, Settings } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

interface GeneralProps {
  websiteId: string;
  initial?: {
    siteName?: string;
    siteTagline?: string;
    language?: string;
    timezone?: string;
  };
}
const CURRENT_LANGUAGE = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
};

const timeZones = Intl.supportedValuesOf("timeZone");

export default function General({ websiteId, initial }: GeneralProps) {
  const [siteName, setSiteName] = useState(initial?.siteName ?? "");
  const [siteTagline, setSiteTagline] = useState(initial?.siteTagline ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "en");
  const [timezone, setTimezone] = useState(initial?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [baseline, setBaseline] = useState({
    siteName: initial?.siteName ?? "",
    siteTagline: initial?.siteTagline ?? "",
    language: initial?.language ?? "en",
    timezone: initial?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const hasChanges =
    siteName !== baseline.siteName ||
    siteTagline !== baseline.siteTagline ||
    language !== baseline.language ||
    timezone !== baseline.timezone;

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

      toast.success("General settings saved");
      setBaseline({ siteName, siteTagline, language, timezone });
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save general settings");
      return { success: false };
    }
  }, null);

  return (
    <section id="general" className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="font-semibold">General Settings</h2>
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Website name, tagline, language, and timezone</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Website name</Label>
              <Input
                placeholder="eg: My Website"
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteTagline">Tagline</Label>
              <Input
                placeholder="eg: The best website ever"
                id="siteTagline"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Disable This Language Select and Show Only the Language which is not Editable */}
              <div className="space-y-2">
                <Label>Language</Label>
                <Input
                  className="bg-slate-300"
                  id={language}
                  value={CURRENT_LANGUAGE[language as keyof typeof CURRENT_LANGUAGE]}
                  readOnly
                />
              </div>

              <div className="space-y-2">
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
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="shrink-0" disabled={saving || !hasChanges}>
                {saving ? <Loader className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
