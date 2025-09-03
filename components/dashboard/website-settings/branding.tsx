"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Loader } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

interface BrandingProps {
  websiteId: string;
  initial?: {
    logoURL?: string;
    faviconURL?: string;
  };
}

export default function Branding({ websiteId, initial }: BrandingProps) {
  const isValidImageUrl = (val?: string) => {
    if (!val) return false;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  };

  const [logoURL, setLogoURL] = useState(initial?.logoURL ?? "");
  const [faviconURL, setFaviconURL] = useState(initial?.faviconURL ?? "");

  const [baseline, setBaseline] = useState({
    logoURL: initial?.logoURL ?? "",
    faviconURL: initial?.faviconURL ?? "",
  });
  const hasChanges = logoURL !== baseline.logoURL || faviconURL !== baseline.faviconURL;

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({ id: websiteId, updates: { logoURL, faviconURL } });
      if (!res.success) throw new Error(res.error || "Failed to update branding");
      setBaseline({ logoURL, faviconURL });
      toast.success("Branding saved");
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save branding");
      return { success: false };
    }
  }, null);

  return (
    <section id="branding" className="space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-5 w-5" />
        <h2 className=" font-semibold">Branding</h2>
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Logo and favicon</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logoURL">Logo URL</Label>
              <Input
                id="logoURL"
                placeholder="eg: https://example.com/logo.png"
                value={logoURL}
                onChange={(e) => setLogoURL(e.target.value)}
              />
              {isValidImageUrl(logoURL) ? (
                <div className="pt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoURL} alt="logo" className="h-10 w-auto object-contain" />
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="faviconURL">Favicon URL</Label>
              <Input
                id="faviconURL"
                placeholder="eg: https://example.com/favicon.ico"
                value={faviconURL}
                onChange={(e) => setFaviconURL(e.target.value)}
              />
              {isValidImageUrl(faviconURL) ? (
                <div className="pt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faviconURL} alt="favicon" className="h-6 w-6 object-contain" />
                </div>
              ) : null}
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="shrink-0" disabled={saving || !hasChanges}>
                {saving ? (
                  <>
                    <Loader className="h-3 w-3 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
