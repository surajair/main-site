"use client";

import { createSite } from "@/actions/create-site-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Globe, Loader, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const allLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

export default function NewWebsitePage() {
  const router = useRouter();
  const [websiteName, setWebsiteName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [defaultLanguage, _setDefaultLanguage] = useState("en");
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Generate subdomain from website name
  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const setDefaultLanguage = (language: string) => {
    _setDefaultLanguage(language);
    setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== language));
  };

  const handleWebsiteNameChange = (value: string) => {
    setWebsiteName(value);
    setSubdomain(generateSubdomain(value));
  };

  const handleLanguageToggle = (languageValue: string, checked: boolean) => {
    if (checked && additionalLanguages.length < 2) {
      setAdditionalLanguages([...additionalLanguages, languageValue]);
    } else if (!checked) {
      setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== languageValue));
    }
  };

  const handleCreateWebsite = async () => {
    if (!websiteName.trim()) return;

    setIsCreating(true);

    try {
      const formData = {
        name: websiteName,
        fallbackLang: defaultLanguage,
        languages: additionalLanguages,
        subdomain: subdomain,
      };

      const result = await createSite(formData);

      if (result.success && result.data) {
        toast.success("Website created successfully!");
        router.push(`/websites/website/${result.data.id}/details`);
      } else {
        toast.error(result.error || "Failed to create website");
        setIsCreating(false);
      }
    } catch (error) {
      toast.error("An error occurred while creating the website");
      setIsCreating(false);
    }
  };

  const getLanguageName = (code: string) => {
    return allLanguages.find((lang) => lang.code === code)?.name || code;
  };

  return (
    <div className="bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="gap-4 mb-8">
          <Link href="/websites">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to websites
            </Button>
          </Link>
          <div className="pt-2">
            <h1 className="text-3xl font-playfair font-bold">Add New Website</h1>
            <p className="text-muted-foreground mt-1 text-sm">Create a new website</p>
          </div>
        </div>

        <Card className="border-0 p-0 shadow-none pb-16">
          <CardContent className="space-y-6 p-0">
            {/* Website Name */}
            <div className="space-y-2">
              <Label htmlFor="websiteName">Website Name</Label>
              <Input
                id="websiteName"
                value={websiteName}
                onChange={(e) => handleWebsiteNameChange(e.target.value)}
                placeholder="My Awesome Website"
              />
            </div>

            {/* Subdomain Preview */}
            <div className="space-y-2">
              <Label>Subdomain</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">
                  {subdomain || "your-website-name"}.{process.env.NEXT_PUBLIC_SUBDOMAIN}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">This subdomain cannot be changed after creation</p>
            </div>

            {/* Default Language */}
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger className="h-11 focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono border rounded px-2 bg-muted">{lang.code}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Default language cannot be changed after creation</p>
            </div>

            {/* Additional Languages */}
            <div className="space-y-2">
              <div className="pb-2">
                <div className="flex items-center justify-between pb-1">
                  <Label>Additional Languages (Optional)</Label>
                  <p className="text-xs text-muted-foreground">Selected: {additionalLanguages.length}/2</p>
                </div>
                <p className="text-xs text-muted-foreground">Select up to 2 additional languages for your website</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {allLanguages.map(
                  (language) =>
                    defaultLanguage !== language.code && (
                      <div key={language.code} className="flex items-center space-x-2">
                        <Checkbox
                          id={language.code}
                          checked={additionalLanguages.includes(language.code)}
                          onCheckedChange={(checked) => handleLanguageToggle(language.code, checked as boolean)}
                          disabled={!additionalLanguages.includes(language.code) && additionalLanguages.length >= 2}
                        />
                        <Label htmlFor={language.code} className="text-sm">
                          {language.name}
                        </Label>
                      </div>
                    ),
                )}
              </div>
            </div>

            {/* Language Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Language Configuration</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-mono border rounded px-2 bg-background">{defaultLanguage}</span>
                  <span>{getLanguageName(defaultLanguage)}</span>
                  <Badge variant="outline" className="text-xs text-[12px] py-px">
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                    Default
                  </Badge>
                </div>
                {additionalLanguages.map((langCode) => (
                  <div key={langCode} className="flex items-center gap-2">
                    <span className="font-mono border rounded px-2 bg-background">{langCode}</span>
                    <span>{getLanguageName(langCode)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="flex gap-3 pt-4">
              <Link href="/websites">
                <Button variant="outline" disabled={isCreating}>
                  Cancel
                </Button>
              </Link>
              <Button onClick={handleCreateWebsite} disabled={!websiteName.trim() || isCreating} className="flex-1">
                {isCreating ? (
                  <>
                    <Loader className="h-3 w-3 animate-spin" />
                    Creating Website
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Website
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
