"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteData } from "@/utils/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";

// List of social networking sites
const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { value: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/yourusername" },
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourusername" },
  { value: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
  { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { value: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourusername" },
  { value: "github", label: "GitHub", placeholder: "https://github.com/yourusername" },
];

type SocialLinkItem = {
  key: string;
  value: string;
};

type SocialLinksObject = Record<string, string>;

interface SocialLinksProps {
  value: SocialLinkItem[];
  onChange: (links: SocialLinkItem[]) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  newValue: string;
  setNewValue: (value: string) => void;
}

function SocialLinks({
  value,
  onChange,
  selectedPlatform,
  setSelectedPlatform,
  newValue,
  setNewValue,
}: SocialLinksProps) {
  const getPlatformInfo = (key: string) => {
    return SOCIAL_PLATFORMS.find((platform) => platform.value === key);
  };

  const getAvailablePlatforms = () => {
    return SOCIAL_PLATFORMS.filter((platform) => !value.some((item) => item.key === platform.value));
  };

  const getAvailablePlatformsForEdit = (currentPlatform: string) => {
    return SOCIAL_PLATFORMS.filter(
      (platform) => platform.value === currentPlatform || !value.some((item) => item.key === platform.value)
    );
  };

  const addSocialLink = () => {
    const platform = selectedPlatform.trim();
    const url = newValue.trim();

    if (!platform || !url) return;
    if (value.some((item) => item.key === platform)) return;

    onChange([...value, { key: platform, value: url }]);
    setSelectedPlatform("");
    setNewValue("");
  };

  const removeSocialLink = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateSocialValue = (index: number, newUrl: string) => {
    onChange(value.map((item, i) => (i === index ? { ...item, value: newUrl } : item)));
  };

  const changePlatformType = (index: number, newKey: string) => {
    if (value.some((item, i) => i !== index && item.key === newKey)) return;
    onChange(value.map((item, i) => (i === index ? { ...item, key: newKey } : item)));
  };

  const hasIncompleteLinks = value.some((item) => !item.key.trim() || !item.value.trim());
  const availablePlatforms = getAvailablePlatforms();

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Social Links</Label>
      <div className="space-y-2">
        {value.map((item, index) => {
          const platformInfo = getPlatformInfo(item.key);
          const availableForEdit = getAvailablePlatformsForEdit(item.key);

          return (
            <div key={index} className="flex items-center gap-2">
              <Select value={item.key} onValueChange={(newKey) => changePlatformType(index, newKey)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {availableForEdit.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={item.value}
                onChange={(e) => updateSocialValue(index, e.target.value)}
                placeholder={platformInfo?.placeholder || "Enter URL"}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSocialLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        {availablePlatforms.length > 0 && !hasIncompleteLinks && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder={
                  selectedPlatform
                    ? getPlatformInfo(selectedPlatform)?.placeholder || "Enter URL"
                    : "Select a platform"
                }
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                disabled={!selectedPlatform}
                className="flex-1"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              disabled={!selectedPlatform || !newValue.trim()}
              className="mt-1"
            >
              Add Link
            </Button>
          </div>
        )}

        {hasIncompleteLinks && (
          <p className="text-sm text-amber-600">Please complete all social links before adding new ones.</p>
        )}
      </div>
    </div>
  );
}

interface ContactSocialProps {
  websiteId: string;
  data: SiteData;
  onChange?: (updates: any) => void;
}

const convertToSocialLinksArray = (links?: Record<string, string>): SocialLinkItem[] => {
  if (!links) return [];
  return Object.entries(links)
    .filter(([_, value]) => value)
    .map(([key, value]) => ({
      key,
      value: String(value)
    }));
};

const convertToSocialLinksObject = (items: SocialLinkItem[]): SocialLinksObject => {
  return items.reduce((acc, item) => {
    if (item.key && item.value) {
      acc[item.key] = item.value;
    }
    return acc;
  }, {} as SocialLinksObject);
};

export default function ContactSocial({ websiteId, data, onChange }: ContactSocialProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [newValue, setNewValue] = useState("");
  
  const socialLinks = convertToSocialLinksArray(data?.settings?.socialLinks);

  const handleInputChange = (field: 'email' | 'phone' | 'address', value: string) => {
    if (!onChange) return;
    
    onChange({
      settings: {
        ...data.settings,
        [field]: value
      }
    });
  };

  const handleSocialLinksChange = (newLinks: SocialLinkItem[]) => {
    if (!onChange) return;
    
    onChange({
      settings: {
        ...data.settings,
        socialLinks: convertToSocialLinksObject(newLinks)
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@example.com"
            value={data?.settings?.email || ""}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data?.settings?.phone || ""}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address
          </Label>
          <Input
            id="address"
            placeholder="123 Main St, City, Country"
            value={data?.settings?.address || ""}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>

        <SocialLinks 
          value={socialLinks}
          onChange={handleSocialLinksChange}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          newValue={newValue}
          setNewValue={setNewValue}
        />
      </div>
    </div>
  );
}
