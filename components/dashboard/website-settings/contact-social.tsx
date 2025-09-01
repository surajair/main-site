"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Share2, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

type SocialLinks = Record<string, string> & {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
};

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
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone ?? "");
  const [contactAddress, setContactAddress] = useState(initial?.contactAddress ?? "");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initial?.socialLinks ?? {});

  const [baseline, setBaseline] = useState({
    contactEmail: initial?.contactEmail ?? "",
    contactPhone: initial?.contactPhone ?? "",
    contactAddress: initial?.contactAddress ?? "",
    socialLinks: initial?.socialLinks ?? {},
  });

  const hasChanges =
    contactEmail !== baseline.contactEmail ||
    contactPhone !== baseline.contactPhone ||
    contactAddress !== baseline.contactAddress ||
    JSON.stringify(socialLinks) !== JSON.stringify(baseline.socialLinks);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addSocial = () => {
    const key = newKey.trim();
    const val = newValue.trim();
    if (!key || !val) return;
    setSocialLinks((s) => ({ ...s, [key]: val }));
    setNewKey("");
    setNewValue("");
  };

  const removeSocial = (key: string) => {
    setSocialLinks((s) => {
      const next = { ...s };
      delete next[key];
      return next;
    });
  };

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { contactEmail, contactPhone, contactAddress, socialLinks },
      });
      if (!res.success) throw new Error(res.error);
      toast.success("Contact & Social saved");
      setBaseline({
        contactEmail,
        contactPhone,
        contactAddress,
        socialLinks: { ...socialLinks },
      });
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Contact & Social");
      return { success: false };
    }
  }, null);

  return (
    <section id="contact-social" className="space-y-4">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5" />
        <h2 className=" font-semibold">Contact & Social</h2>
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Contact & Social</CardTitle>
          <CardDescription>Ways to reach you and social profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactAddress">Address</Label>
              <Input id="contactAddress" value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Social links</Label>
              <div className="space-y-2">
                {Object.entries(socialLinks).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-56 text-sm text-muted-foreground capitalize">{key}</span>
                    <Input value={val} onChange={(e) => setSocialLinks((s) => ({ ...s, [key]: e.target.value }))} />
                    <Button type="button" variant="ghost" onClick={() => removeSocial(key)} className="shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Platform name"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-56"
                  />
                  <Input placeholder="https://..." value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                </div>
                <div>
                  <Button type="button" variant="ghost" onClick={addSocial} className="mt-2 w-40">
                    Add social link
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || !hasChanges}>
                {saving ? <Loader className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
