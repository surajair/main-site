"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "lucide-react";
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

export default function General({ websiteId, initial }: GeneralProps) {
  const [siteName, setSiteName] = useState(initial?.siteName ?? "");
  const [siteTagline, setSiteTagline] = useState(initial?.siteTagline ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "en");
  const [timezone, setTimezone] = useState(initial?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { siteName, siteTagline, language, timezone },
      });
      if (!res.success) throw new Error(res.error);

      toast.success("General settings saved");
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save general settings");
      return { success: false };
    }
  }, null);

  return (
    <section id="general" className="space-y-4">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic site information</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site name</Label>
              <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteTagline">Tagline</Label>
              <Input id="siteTagline" value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="shrink-0" disabled={saving}>
                {saving ? <Loader className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
