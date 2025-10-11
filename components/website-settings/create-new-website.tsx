"use client";

import { createSite } from "@/actions/create-site-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLanguagesArray } from "@/lib/language-config";
import { usePlanLimits } from "@/lib/openfeature/helper";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "chai-next";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UpgradeModalButton from "../upgrade/upgrade-modal-button";
import { useClientSettings } from "@/hooks/use-client-settings";

const allLanguages = getLanguagesArray();

interface CreateNewWebsiteProps {
  children: React.ReactNode;
  totalSites: number;
}
export function toKebabCase(str = "") {
  return String(str)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function subdomainFormat(str = "") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function CreateNewWebsite({ children, totalSites }: CreateNewWebsiteProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [isSubdomainModified, setIsSubdomainModified] = useState(false);
  const { data: clientSettings } = useClientSettings();
  const [defaultLanguage, setDefaultLanguage] = useState(clientSettings?.defaultSiteLang || "");
  const [isCreating, setIsCreating] = useState(false);
  const planLimits = usePlanLimits();
  const queryClient = useQueryClient();
  const isSiteLimitReached = planLimits?.hasReached("no_of_sites", totalSites);
  

  const handleWebsiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsiteName(value);
    if (!isSubdomainModified) {
      setSubdomain(toKebabCase(value));
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = subdomainFormat(e.target.value);
    setSubdomain(value);
    setIsSubdomainModified(value?.length > 0);
  };

  const handleCreateWebsite = async () => {
    if (!websiteName.trim()) return;

    setIsCreating(true);

    try {
      const finalSubdomain = subdomain.trim().replace(/-+$/g, "") || toKebabCase(websiteName.trim());

      const formData = {
        name: websiteName.trim(),
        fallbackLang: defaultLanguage,
        languages: [],
        subdomain: finalSubdomain,
      };

      const result = await createSite(formData);

      if (result.success && result.data) {
        toast.success(t("Website created successfully!"));
        setOpen(false);
        // Reset form
        setWebsiteName("");
        setDefaultLanguage(clientSettings?.defaultSiteLang || "");
        queryClient.invalidateQueries({ queryKey: ["websites-list"] });
        window.location.href = `/${result.data.id}/editor`;
      } else {
        toast.error(result.error || t("Failed to create website"));
        setIsCreating(false);
      }
    } catch (error) {
      toast.error(t("An error occurred while creating the website"));
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
        setDefaultLanguage(clientSettings?.defaultSiteLang || "");
        setIsCreating(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-playfair font-bold">{t("Add New Website")}</DialogTitle>
        </DialogHeader>

        <Card className="border-0 p-0 shadow-none">
          {!isSiteLimitReached ? (
            <CardContent className="space-y-4 p-0">
              {/* Input Field */}
              <div className="space-y-2">
                <Label htmlFor="websiteName">{t("Website Name")}</Label>
                <div className="flex items-center gap-2 border border-border rounded">
                  <Input
                    id="websiteName"
                    value={websiteName}
                    onChange={handleWebsiteNameChange}
                    placeholder={t("My Awesome Website")}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              {/* Subdomain Input Field */}
              <div className="space-y-2">
                <Label htmlFor="subdomain">{t("Subdomain")}</Label>
                <div className="flex items-center gap-2 border border-border rounded pr-2">
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={handleSubdomainChange}
                    placeholder={t("my-awesome-website")}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <span className="text-sm text-muted-foreground pr-3">
                    .{process.env.NEXT_PUBLIC_SUBDOMAIN || "example.com"}
                  </span>
                </div>
              </div>

              {/* Default Language */}
              <div className="space-y-1">
                <Label className="text-xs">{t("Default Language")}</Label>
                {allLanguages.length > 1 ? (
                  <>
                    <Select value={defaultLanguage} onValueChange={setDefaultLanguage} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a language")} />
                      </SelectTrigger>
                      <SelectContent>
                        {allLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">{t("Cannot be changed after creating website")}</div>
                  </>
                ) : (
                  <Input className="bg-gray-100" value={allLanguages[0]?.name} readOnly />
                )}
              </div>

              {/* Create Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="w-full"
                  onClick={handleCreateWebsite}
                  disabled={!websiteName.trim() || !subdomain.trim() || !defaultLanguage || isCreating}>
                  {isCreating ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      {t("Creating Website")}
                    </>
                  ) : (
                    <>
                      <span className="leading-tight">{t("Create Website")}</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="px-0 py-2 flex flex-col items-center justify-center gap-4">
              <div>{t("You have reached the limit of websites you can create.")}</div>
              <UpgradeModalButton />
            </CardContent>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
