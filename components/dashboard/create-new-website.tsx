"use client";

import { createSite } from "@/actions/create-site-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
}
export function toKebabCase(str = "") {
  return String(str)
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .replace(/^-|-$/g, "");
}

export default function CreateNewWebsite({ children }: CreateNewWebsiteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWebsite = async () => {
    if (!websiteName.trim()) return;

    setIsCreating(true);

    try {
      const subdomain = toKebabCase(websiteName.trim());

      const formData = {
        name: websiteName.trim(),
        fallbackLang: defaultLanguage,
        languages: [],
        subdomain: subdomain,
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
        setDefaultLanguage("en");
        setIsCreating(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-playfair font-bold">Add New Website</DialogTitle>
        </DialogHeader>

        <Card className="border-0 p-0 shadow-none">
          <CardContent className="space-y-4 p-0">
            {/* Input Field */}
            <div className="space-y-2">
              <Label htmlFor="websiteName">Website Name</Label>
              <div className="flex items-center gap-2 border border-border rounded">
                <Input
                  id="websiteName"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="My Awesome Website"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                />
              </div>

              {/* URL Preview */}
              {websiteName && (
                <div className="p-3 bg-gray-200 rounded-md">
                  <Label className="text-sm text-gray-600">Subdomain</Label>
                  <p className="font-mono text-sm text-blue-600">
                    {toKebabCase(websiteName)}.{process.env.NEXT_PUBLIC_SUBDOMAIN || "example.com"}
                  </p>
                </div>
              )}
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
              <Button
                onClick={handleCreateWebsite}
                disabled={!websiteName.trim() || isCreating}
                className="flex-1 flex items-center gap-x-3">
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
        </Card>
      </DialogContent>
    </Dialog>
  );
}
