"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSettingsContext } from ".";
import SaveButton from "./save-button";

// List of 25 major social networking sites
const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { value: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/yourusername" },
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourusername" },
  { value: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
  { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { value: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourusername" },
  { value: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/yourusername" },
  { value: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/yourusername" },
  { value: "reddit", label: "Reddit", placeholder: "https://reddit.com/u/yourusername" },
  { value: "discord", label: "Discord", placeholder: "https://discord.gg/yourserver" },
  { value: "telegram", label: "Telegram", placeholder: "https://t.me/yourusername" },
  { value: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/yournumber" },
  { value: "twitch", label: "Twitch", placeholder: "https://twitch.tv/yourusername" },
  { value: "github", label: "GitHub", placeholder: "https://github.com/yourusername" },
  { value: "behance", label: "Behance", placeholder: "https://behance.net/yourusername" },
  { value: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/yourusername" },
  { value: "medium", label: "Medium", placeholder: "https://medium.com/@yourusername" },
  { value: "quora", label: "Quora", placeholder: "https://quora.com/profile/yourname" },
  { value: "tumblr", label: "Tumblr", placeholder: "https://yourusername.tumblr.com" },
  { value: "flickr", label: "Flickr", placeholder: "https://flickr.com/people/yourusername" },
  { value: "vimeo", label: "Vimeo", placeholder: "https://vimeo.com/yourusername" },
  { value: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/yourusername" },
  { value: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/user/yourusername" },
  { value: "clubhouse", label: "Clubhouse", placeholder: "https://clubhouse.com/@yourusername" },
  { value: "mastodon", label: "Mastodon", placeholder: "https://mastodon.social/@yourusername" },
];

type SocialLinks = Record<string, string> & {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
};

type SocialLinkItem = {
  key: string;
  value: string;
};

// Social Links Component
interface SocialLinksProps {
  value: SocialLinkItem[];
  onChange: (links: SocialLinkItem[]) => void;
}

function SocialLinks({ value, onChange }: SocialLinksProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [newValue, setNewValue] = useState("");

  // Helper functions
  const getPlatformInfo = (key: string) => {
    return SOCIAL_PLATFORMS.find((platform) => platform.value === key);
  };

  const getAvailablePlatforms = () => {
    return SOCIAL_PLATFORMS.filter((platform) => !value.some((item) => item.key === platform.value));
  };

  const getAvailablePlatformsForEdit = (currentPlatform: string) => {
    return SOCIAL_PLATFORMS.filter(
      (platform) => platform.value === currentPlatform || !value.some((item) => item.key === platform.value),
    );
  };

  // Actions
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

  // Validation
  const hasIncompleteLinks = value.some((item) => !item.key.trim() || !item.value.trim());
  const availablePlatforms = getAvailablePlatforms();

  return (
    <div className="space-y-1">
      <Label className="text-xs">Social links</Label>
      <div className="space-y-2">
        {/* Existing Social Links */}
        {value.map((item, index) => {
          const platformInfo = getPlatformInfo(item.key);
          const availableForEdit = getAvailablePlatformsForEdit(item.key);

          return (
            <div key={index} className="flex items-center gap-2">
              <Select value={item.key} onValueChange={(newKey) => changePlatformType(index, newKey)}>
                <SelectTrigger className="w-56 shrink-0">
                  <SelectValue placeholder="Select platform">{platformInfo?.label || item.key}</SelectValue>
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
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => removeSocialLink(index)}
                className="shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        {/* Add New Social Link */}
        {availablePlatforms.length > 0 && !hasIncompleteLinks && (
          <>
            <div className="flex items-center gap-2">
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-56 shrink-0">
                  <SelectValue placeholder="Select platform" />
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
                    : "Select a platform first"
                }
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                disabled={!selectedPlatform}
              />
            </div>
            <div className="w-full flex items-center justify-start">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addSocialLink}
                disabled={!selectedPlatform || !newValue.trim()}
                className="mt-1 px-0 hover:bg-transparent hover:underline hover:text-primary">
                + Add social link
              </Button>
            </div>
          </>
        )}

        {/* Status Messages */}
        {hasIncompleteLinks && (
          <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            Please complete all existing social links before adding new ones.
          </div>
        )}

        {availablePlatforms.length === 0 && !hasIncompleteLinks && (
          <div className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-3">
            All available social platforms have been added.
          </div>
        )}
      </div>
    </div>
  );
}

interface ContactSocialProps {
  websiteId: string;
  initial?: {
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
    socialLinks?: SocialLinks;
  };
}

export default function ContactSocial({ websiteId, initial }: ContactSocialProps) {
  const { setHasUnsavedChanges } = useSettingsContext();
  const queryClient = useQueryClient();

  // Helper functions to convert between formats
  const objectToArray = (obj: SocialLinks): SocialLinkItem[] => {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  };

  const arrayToObject = (arr: SocialLinkItem[]): SocialLinks => {
    return arr.reduce((acc, item) => {
      // Only include entries that have both key and value filled
      if (item.key.trim() && item.value.trim()) {
        acc[item.key] = item.value;
      }
      return acc;
    }, {} as SocialLinks);
  };

  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone ?? "");
  const [contactAddress, setContactAddress] = useState(initial?.contactAddress ?? "");
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(objectToArray(initial?.socialLinks ?? {}));

  const [baseline, setBaseline] = useState({
    contactEmail: initial?.contactEmail ?? "",
    contactPhone: initial?.contactPhone ?? "",
    contactAddress: initial?.contactAddress ?? "",
    socialLinks: objectToArray(initial?.socialLinks ?? {}),
  });

  // Update local state when initial data changes
  useEffect(() => {
    if (initial) {
      setContactEmail(initial.contactEmail ?? "");
      setContactPhone(initial.contactPhone ?? "");
      setContactAddress(initial.contactAddress ?? "");
      setSocialLinks(objectToArray(initial.socialLinks ?? {}));

      setBaseline({
        contactEmail: initial.contactEmail ?? "",
        contactPhone: initial.contactPhone ?? "",
        contactAddress: initial.contactAddress ?? "",
        socialLinks: objectToArray(initial.socialLinks ?? {}),
      });
    }
  }, [initial]);

  // Helper function to compare social links arrays
  const socialLinksChanged = () => {
    try {
      // Convert both current and baseline to objects for comparison (only complete entries)
      const currentComplete = arrayToObject(socialLinks);
      const baselineComplete = arrayToObject(baseline.socialLinks);

      const condOne = JSON.stringify(currentComplete) !== JSON.stringify(baselineComplete);
      const condTwo = !(selectedPlatform && newValue.trim());
      return condOne || condTwo;
    } catch (error) {
      return true;
    }
  };

  const hasChanges =
    contactEmail !== baseline.contactEmail ||
    contactPhone !== baseline.contactPhone ||
    contactAddress !== baseline.contactAddress ||
    socialLinksChanged();

  // Update unsaved changes in context whenever hasChanges changes
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [newValue, setNewValue] = useState("");

  // Check if all existing social links have both platform and URL filled
  const hasIncompleteLinks = socialLinks.some((item) => !item.key.trim() || !item.value.trim());

  const addSocial = () => {
    const platform = selectedPlatform.trim();
    const val = newValue.trim();

    // Check if platform already exists
    if (socialLinks.some((item) => item.key === platform)) {
      return;
    }

    setSocialLinks((s) => [...s, { key: platform, value: val }]);
    setSelectedPlatform("");
    setNewValue("");
  };

  // Get available platforms for new additions (not already added)
  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (platform) => !socialLinks.some((item) => item.key === platform.value),
  );

  // Get available platforms for editing existing entries (exclude current platform and already used ones)
  const getAvailablePlatformsForEdit = (currentPlatform: string) => {
    return SOCIAL_PLATFORMS.filter(
      (platform) => platform.value === currentPlatform || !socialLinks.some((item) => item.key === platform.value),
    );
  };

  // Get platform info for display
  const getPlatformInfo = (key: string) => {
    return SOCIAL_PLATFORMS.find((platform) => platform.value === key);
  };

  // Handle platform type change for existing social links
  const changePlatformType = (index: number, newKey: string) => {
    // Check if new platform already exists
    if (socialLinks.some((item, i) => i !== index && item.key === newKey)) {
      return;
    }

    setSocialLinks((s) => s.map((item, i) => (i === index ? { ...item, key: newKey } : item)));
  };

  const removeSocial = (index: number) => {
    setSocialLinks((s) => s.filter((_, i) => i !== index));
  };

  const updateSocialValue = (index: number, value: string) => {
    setSocialLinks((s) => s.map((item, i) => (i === index ? { ...item, value } : item)));
  };

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      // Convert array to object and filter out empty entries
      const socialLinksObject = arrayToObject(socialLinks);

      const res = await updateWebsiteData({
        id: websiteId,
        updates: { contactEmail, contactPhone, contactAddress, socialLinks: socialLinksObject },
      });
      if (!res.success) throw new Error(res.error);

      toast.success("Contact & Social saved");

      // Update baseline to reflect saved state (only complete entries)
      const savedArray = objectToArray(socialLinksObject);
      const newBaseline = {
        contactEmail,
        contactPhone,
        contactAddress,
        socialLinks: JSON.parse(JSON.stringify(savedArray)), // Deep copy to avoid reference issues
      };
      setBaseline(newBaseline);

      // Keep current local state as is - don't overwrite with filtered data
      // This preserves any incomplete entries the user is working on

      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Contact & Social");
      return { success: false };
    }
  }, null);

  return (
    <section id="contact-social">
      <form action={saveAll} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="contactEmail" className="text-xs">
            Contact email
          </Label>
          <Input
            id="contactEmail"
            placeholder="eg: user@example.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contactPhone" className="text-xs">
            Phone
          </Label>
          <Input
            id="contactPhone"
            placeholder="eg: XXXXXX"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contactAddress" className="text-xs">
            Address
          </Label>
          <Input
            id="contactAddress"
            placeholder="eg: 123 Main St, City, Country"
            value={contactAddress}
            onChange={(e) => setContactAddress(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Social links</Label>
          <div className="space-y-2">
            {socialLinks.map((item, index) => {
              const platformInfo = getPlatformInfo(item.key);
              const availableForEdit = getAvailablePlatformsForEdit(item.key);
              return (
                <div key={index} className="flex items-center gap-2">
                  <Select value={item.key} onValueChange={(newKey) => changePlatformType(index, newKey)}>
                    <SelectTrigger className="w-56 shrink-0">
                      <SelectValue placeholder="Select platform">{platformInfo?.label || item.key}</SelectValue>
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
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => removeSocial(index)}
                    className="shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}

            {availablePlatforms.length > 0 && !hasIncompleteLinks && (
              <>
                <div className="flex items-center gap-2">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-56 shrink-0">
                      <SelectValue placeholder="Select platform" />
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
                        : "Select a platform first"
                    }
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    disabled={!selectedPlatform}
                  />
                </div>
                <div className="w-full flex items-center justify-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addSocial}
                    disabled={!selectedPlatform || !newValue.trim()}
                    className="mt-1 px-0 hover:bg-transparent hover:underline hover:text-primary">
                    + Add social link
                  </Button>
                </div>
              </>
            )}

            {hasIncompleteLinks && (
              <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                Please complete all existing social links before adding new ones.
              </div>
            )}

            {availablePlatforms.length === 0 && !hasIncompleteLinks && (
              <div className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-3">
                All available social platforms have been added.
              </div>
            )}
          </div>
        </div>

        <SaveButton saving={saving} hasChanges={hasChanges} />
      </form>
    </section>
  );
}
