"use client";

import { updateSite } from "@/actions/update-site-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
interface WebsiteInformationProps {
  websiteId: string;
  siteData: {
    id: any;
    name: any;
    createdAt: any;
    fallbackLang: any;
    languages: any;
    app_api_keys: { apiKey: any }[];
  };
  initialWebsiteName?: string;
  initialAdditionalLanguages?: string[];
}

function WebsiteInformation({
  websiteId,
  siteData,
  initialWebsiteName,
  initialAdditionalLanguages,
}: WebsiteInformationProps) {
  const router = useRouter();
  const [websiteName, setWebsiteName] = useState(initialWebsiteName || siteData.name || "My Awesome Website");
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>(
    initialAdditionalLanguages || siteData.languages || [],
  );

  // Track original values for comparison
  const [originalWebsiteName, setOriginalWebsiteName] = useState(siteData.name);
  const [originalAdditionalLanguages, setOriginalAdditionalLanguages] = useState<string[]>(siteData.languages || []);

  useEffect(() => {
    setWebsiteName(siteData.name);
    setAdditionalLanguages(siteData.languages);
    setOriginalWebsiteName(siteData.name);
    setOriginalAdditionalLanguages(siteData.languages || []);
  }, [siteData]);

  // Check if data has changed
  const hasChanges =
    websiteName !== originalWebsiteName ||
    JSON.stringify(additionalLanguages.sort()) !== JSON.stringify(originalAdditionalLanguages.sort());

  const [updateState, updateAction, updatePending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const websiteName = formData.get("websiteName") as string;
      const result = await updateSite(websiteId, {
        name: websiteName,
        languages: additionalLanguages,
      });

      if (result.success) {
        toast.success("Website information updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update website information");
      }

      return result;
    },
    { success: false, error: null },
  );

  const availableLanguages = [
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
  ];

  const handleLanguageToggle = (languageValue: string, checked: boolean) => {
    if (checked && additionalLanguages.length < 2) {
      setAdditionalLanguages([...additionalLanguages, languageValue]);
    } else if (!checked) {
      setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageValue));
    }
  };

  return (
    <section id="general" className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="font-semibold">General Settings</h2>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Website Information</CardTitle>
          <CardDescription>Update your website name and language settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-4">
            <input type="hidden" name="websiteId" value={websiteId} />
            <div className="space-y-2">
              <Label htmlFor="website-name">Website Name</Label>
              <Input
                id="website-name"
                name="websiteName"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="Enter website name"
              />
            </div>

            <div className="space-y-2">
              <Label>Default Language</Label>
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">English (en)</span>
                <p className="text-xs text-muted-foreground mt-1">Default language cannot be changed</p>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label>Additional Languages (Optional)</Label>
              <p className="text-xs text-muted-foreground">Select up to 2 additional languages for your website</p>
              <div className="grid grid-cols-3 gap-3">
                {availableLanguages.map((language) => (
                  <div key={language.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={language.value}
                      checked={additionalLanguages.includes(language.value)}
                      onCheckedChange={(checked) => handleLanguageToggle(language.value, checked as boolean)}
                      disabled={!additionalLanguages.includes(language.value) && additionalLanguages.length >= 2}
                    />
                    <Label htmlFor={language.value} className="text-sm">
                      {language.label}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Selected: {additionalLanguages.length}/2</p>
            </div> */}

            <div className="flex justify-end">
              <Button type="submit" disabled={updatePending || !hasChanges} className="w-auto">
                {updatePending ? (
                  <>
                    <Loader className="h-3 w-3 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

WebsiteInformation.displayName = "WebsiteInformation";

export default WebsiteInformation;
