"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeClosedIcon, EyeIcon, Loader, Shield } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

interface SpamProtectionProps {
  websiteId: string;
  initial?: {
    recaptchaSiteKey?: string;
    recaptchaSecretKey?: string;
  };
}

export default function SpamProtection({ websiteId, initial }: SpamProtectionProps) {
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(initial?.recaptchaSiteKey ?? "");
  const [recaptchaSecretKey, setRecaptchaSecretKey] = useState(initial?.recaptchaSecretKey ?? "");
  const [showRecaptchaSecretKey, setShowRecaptchaSecretKey] = useState(false);

  const [baseline, setBaseline] = useState({
    recaptchaSiteKey: initial?.recaptchaSiteKey ?? "",
    recaptchaSecretKey: initial?.recaptchaSecretKey ?? "",
  });

  const hasChanges =
    recaptchaSiteKey !== baseline.recaptchaSiteKey || recaptchaSecretKey !== baseline.recaptchaSecretKey;

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { recaptchaSiteKey, recaptchaSecretKey },
      });
      if (!res.success) throw new Error(res.error);
      toast.success("Spam Protection saved");
      setBaseline({ recaptchaSiteKey, recaptchaSecretKey });
      return { success: true } as const;
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Spam Protection");
      return { success: false } as const;
    }
  }, null);

  return (
    <section id="spam-protection" className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        <h2 className=" font-semibold">Spam Protection</h2>
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Spam Protection</CardTitle>
          <CardDescription>Manage ReCAPTCHA keys</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recaptchaSiteKey">ReCAPTCHA website key</Label>
              <Input
                id="recaptchaSiteKey"
                value={recaptchaSiteKey}
                placeholder="eg: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXqg6y0"
                onChange={(e) => setRecaptchaSiteKey(e.target.value)}
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="recaptchaSecretKey">ReCAPTCHA secret key</Label>
              <Input
                id="recaptchaSecretKey"
                type={showRecaptchaSecretKey ? "text" : "password"}
                placeholder="eg: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXqg6y0"
                value={recaptchaSecretKey}
                onChange={(e) => setRecaptchaSecretKey(e.target.value)}
              />
              {showRecaptchaSecretKey ? (
                <EyeIcon
                  className="absolute right-3 top-[63%] -translate-y-1/2 w-4 h-4 cursor-pointer text-gray-500"
                  onClick={() => setShowRecaptchaSecretKey(!showRecaptchaSecretKey)}
                />
              ) : (
                <EyeClosedIcon
                  className="absolute right-3 top-[63%] -translate-y-1/2 w-4 h-4 cursor-pointer text-gray-500"
                  onClick={() => setShowRecaptchaSecretKey(!showRecaptchaSecretKey)}
                />
              )}
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
