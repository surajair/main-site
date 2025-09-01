"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Search, X } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

interface SeoMetadataProps {
  websiteId: string;
  initial?: {
    sitePageTitle?: string;
    siteMetaDescription?: string;
    siteMetaKeywords?: string[];
    siteOpenGraphImageURL?: string;
    googleSiteVerification?: string;
    enableRobotsCrawling?: boolean;
  };
}

export default function SeoMetadata({ websiteId, initial }: SeoMetadataProps) {
  const [sitePageTitle, setSitePageTitle] = useState(initial?.sitePageTitle ?? "");
  const [siteMetaDescription, setSiteMetaDescription] = useState(initial?.siteMetaDescription ?? "");
  const [siteMetaKeywords, setSiteMetaKeywords] = useState<string[]>(initial?.siteMetaKeywords ?? []);
  const [keywordInput, setKeywordInput] = useState("");
  const [siteOpenGraphImageURL, setSiteOpenGraphImageURL] = useState(initial?.siteOpenGraphImageURL ?? "");
  const [googleSiteVerification, setGoogleSiteVerification] = useState(initial?.googleSiteVerification ?? "");
  const [enableRobotsCrawling, setEnableRobotsCrawling] = useState<boolean>(initial?.enableRobotsCrawling ?? true);

  const addKeyword = () => {
    const v = keywordInput.trim();
    if (!v) return;
    if (siteMetaKeywords.includes(v)) return;
    setSiteMetaKeywords((k) => [...k, v]);
    setKeywordInput("");
  };
  const removeKeyword = (v: string) => setSiteMetaKeywords((k) => k.filter((x) => x !== v));

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: {
          sitePageTitle,
          siteMetaDescription,
          siteMetaKeywords,
          siteOpenGraphImageURL,
          googleSiteVerification,
          enableRobotsCrawling,
        },
      });
      if (!res.success) throw new Error(res.error);
      toast.success("SEO & Metadata saved");
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save SEO & Metadata");
      return { success: false };
    }
  }, null);

  return (
    <section id="seo-metadata" className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5" />
        <h2 className=" font-semibold">SEO & Metadata</h2>
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>SEO & Metadata</CardTitle>
          <CardDescription>Search engine and social meta settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sitePageTitle">Page title</Label>
              <Input id="sitePageTitle" value={sitePageTitle} onChange={(e) => setSitePageTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteMetaDescription">Meta description</Label>
              <Textarea
                id="siteMetaDescription"
                value={siteMetaDescription}
                onChange={(e) => setSiteMetaDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Meta keywords</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                />
                <Button type="button" onClick={addKeyword} variant="secondary">
                  Add
                </Button>
              </div>
              {siteMetaKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {siteMetaKeywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm">
                      {kw}
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => removeKeyword(kw)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteOpenGraphImageURL">Open Graph image URL</Label>
              <Input
                id="siteOpenGraphImageURL"
                value={siteOpenGraphImageURL}
                onChange={(e) => setSiteOpenGraphImageURL(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleSiteVerification">Google site verification</Label>
              <Input
                id="googleSiteVerification"
                value={googleSiteVerification}
                onChange={(e) => setGoogleSiteVerification(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <Label>Allow robots crawling</Label>
              </div>
              <Switch checked={enableRobotsCrawling} onCheckedChange={setEnableRobotsCrawling} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
