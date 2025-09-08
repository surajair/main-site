"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { removeBrandingAsset, uploadBrandingAsset } from "@/actions/upload-branding-asset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface BrandingProps {
  websiteId: string;
  initial?: {
    logoURL?: string;
    faviconURL?: string;
  };
}

export default function BrandingConfiguration({ websiteId, initial }: BrandingProps) {
  const queryClient = useQueryClient();

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
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [logoRemoving, setLogoRemoving] = useState(false);
  const [faviconRemoving, setFaviconRemoving] = useState(false);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);

  const updateBrandingData = async (updates: { logoURL?: string; faviconURL?: string }) => {
    try {
      const res = await updateWebsiteData({ id: websiteId, updates });
      if (!res.success) throw new Error(res.error || "Failed to update branding");
      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
      return true;
    } catch (e: any) {
      toast.error(e?.message || "Failed to update branding");
      return false;
    }
  };

  const handleFileUpload = async (file: File, type: "logo" | "favicon") => {
    if (type === "logo") {
      setLogoUploading(true);
    } else {
      setFaviconUploading(true);
    }

    try {
      const result = await uploadBrandingAsset({
        websiteId,
        file,
        type: type === "logo" ? "logo" : "favicon",
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      const newUrl = result.url;
      const updates = type === "logo" ? { logoURL: newUrl } : { faviconURL: newUrl };

      const success = await updateBrandingData(updates);
      if (success) {
        if (type === "logo") {
          setLogoURL(newUrl);
        } else {
          setFaviconURL(newUrl);
        }
        toast.success(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully`);
      }
    } catch (error: any) {
      toast.error(error?.message || `Failed to upload ${type}`);
    } finally {
      if (type === "logo") {
        setLogoUploading(false);
      } else {
        setFaviconUploading(false);
      }
    }
  };

  const handleRemove = async (type: "logo" | "favicon") => {
    if (type === "logo") {
      setLogoRemoving(true);
    } else {
      setFaviconRemoving(true);
    }

    try {
      const currentUrl = type === "logo" ? logoURL : faviconURL;

      // Remove from Supabase storage
      await removeBrandingAsset({
        websiteId,
        type,
        currentUrl,
      });

      // Update database
      const updates = type === "logo" ? { logoURL: "" } : { faviconURL: "" };
      const success = await updateBrandingData(updates);

      if (success) {
        if (type === "logo") {
          setLogoURL("");
        } else {
          setFaviconURL("");
        }
        toast.success(`${type === "logo" ? "Logo" : "Favicon"} removed successfully`);
      }
    } catch (error: any) {
      toast.error(error?.message || `Failed to remove ${type}`);
    } finally {
      if (type === "logo") {
        setLogoRemoving(false);
      } else {
        setFaviconRemoving(false);
      }
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, "logo");
    }
  };

  const handleFaviconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, "favicon");
    }
  };

  return (
    <section id="branding">
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs">Logo</Label>
          {isValidImageUrl(logoURL) ? (
            <div className="flex items-center gap-x-4 border p-4 rounded-md">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoURL} alt="logo" className="h-10 w-auto object-contain rounded" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemove("logo")}
                disabled={logoRemoving}
                className="flex items-center gap-2 hover:border-red-500 hover:text-red-500">
                {logoRemoving ? <Loader className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                {logoRemoving ? "Removing" : "Remove Logo"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full border rounded-md p-4">
              <div className="flex items-center gap-2 w-1/3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={logoUploading}
                  className="flex items-center gap-2 w-full">
                  {logoUploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {logoUploading ? "Uploading" : "Upload Logo"}
                </Button>
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
              </div>
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex items-center gap-2 relative w-full">
                <Input
                  placeholder="eg: https://example.com/logo.png"
                  value={logoURL}
                  onChange={(e) => setLogoURL(e.target.value)}
                  onBlur={() => logoURL && updateBrandingData({ logoURL })}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Favicon</Label>
          {isValidImageUrl(faviconURL) ? (
            <div className=" flex items-center gap-x-4 border p-4 rounded-md">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={faviconURL} alt="favicon" className="h-6 w-6 object-contain rounded" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemove("favicon")}
                disabled={faviconRemoving}
                className="flex items-center gap-2 hover:border-red-500 hover:text-red-500">
                {faviconRemoving ? <Loader className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                {faviconRemoving ? "Removing" : "Remove Favicon"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full border rounded-md p-4">
              <div className="flex items-center gap-2 w-1/3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => faviconFileRef.current?.click()}
                  disabled={faviconUploading}
                  className="flex items-center gap-2 w-full">
                  {faviconUploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {faviconUploading ? "Uploading" : "Upload Favicon"}
                </Button>
                <input
                  ref={faviconFileRef}
                  type="file"
                  accept="image/*,.ico"
                  onChange={handleFaviconFileChange}
                  className="hidden"
                />
              </div>
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex items-center gap-2 relative w-full">
                <Input
                  placeholder="eg: https://example.com/favicon.ico"
                  value={faviconURL}
                  onChange={(e) => setFaviconURL(e.target.value)}
                  onBlur={() => faviconURL && updateBrandingData({ faviconURL })}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
