"use client";

import { createSite } from "@/actions/create-site-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFlag } from "@openfeature/react-sdk";
import { Loader } from "lucide-react";
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

interface CreateNewWebsiteProps {
  children: React.ReactNode;
  totalSites: number;
}
export function toKebabCase(str = "") {
  return String(str)
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .replace(/^-|-$/g, "");
}

export default function CreateNewWebsite({ children, totalSites }: CreateNewWebsiteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [isSubdomainModified, setIsSubdomainModified] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [isCreating, setIsCreating] = useState(false);
  const { value: siteLimits } = useFlag("no_of_sites", 1);
  const { value: canCreateSite } = useFlag("create_site", true);

  const handleWebsiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsiteName(value);
    if (!isSubdomainModified) {
      setSubdomain(toKebabCase(value));
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, "");
    setSubdomain(value);
    setIsSubdomainModified(true);
  };

  const handleCreateWebsite = async () => {
    if (!websiteName.trim()) return;

    setIsCreating(true);

    try {
      const finalSubdomain = subdomain.trim() || toKebabCase(websiteName.trim());

      const formData = {
        name: websiteName.trim(),
        fallbackLang: defaultLanguage,
        languages: [],
        subdomain: finalSubdomain,
      };

      const result = await createSite(formData);

      if (result.success && result.data) {
        toast.success("Website created successfully!");
        setOpen(false);
        // Reset form
        setWebsiteName("");
        setDefaultLanguage("en");
        router.push(`/${result.data.id}/editor`);
      } else {
        toast.error(result.error || "Failed to create website");
        setIsCreating(false);
      }
    } catch (error) {
      toast.error("An error occurred while creating the website");
      setIsCreating(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isCreating) {
      setOpen(open);
      if (!open) {
        setWebsiteName("");
        setSubdomain("");
        setIsSubdomainModified(false);
        setDefaultLanguage("en");
        setIsCreating(false);
      }
    }
  };

  if (!canCreateSite) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-playfair font-bold">Add New Website</DialogTitle>
        </DialogHeader>

        <Card className="border-0 p-0 shadow-none">
          {totalSites < siteLimits ? (
            <CardContent className="space-y-4 p-0">
              {/* Input Field */}
              <div className="space-y-2">
                <Label htmlFor="websiteName">Website Name</Label>
                <div className="flex items-center gap-2 border border-border rounded">
                  <Input
                    id="websiteName"
                    value={websiteName}
                    onChange={handleWebsiteNameChange}
                    placeholder="My Awesome Website"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                  />
                </div>
              </div>

              {/* Subdomain Input Field */}
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center gap-2 border border-border rounded">
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={handleSubdomainChange}
                    placeholder="my-awesome-website"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium font-mono"
                  />
                  <span className="text-sm text-muted-foreground pr-3">
                    .{process.env.NEXT_PUBLIC_SUBDOMAIN || "example.com"}
                  </span>
                </div>
              </div>

              {/* Default Language */}
              <div className="space-y-1">
                <Label className="text-xs">Default Language</Label>
                <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">Cannot be changed after creating website</div>
              </div>

              {/* Create Button */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateWebsite} disabled={!websiteName.trim() || !subdomain.trim() || isCreating}>
                  {isCreating ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      Creating Website
                    </>
                  ) : (
                    <>
                      <span className="leading-tight">Create Website</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardDescription className="text-center h-44 flex flex-col items-center justify-center">
              You have reached the limit of websites you can create.
            </CardDescription>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
