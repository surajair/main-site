"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import SaveButton from "./save-button";

interface AnalyticsTrackingProps {
  websiteId: string;
  initial?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    metaPixelId?: string;
  };
}

export default function AnalyticsTracking({ websiteId, initial }: AnalyticsTrackingProps) {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(initial?.googleAnalyticsId ?? "");
  const [googleTagManagerId, setGoogleTagManagerId] = useState(initial?.googleTagManagerId ?? "");
  const [metaPixelId, setMetaPixelId] = useState(initial?.metaPixelId ?? "");

  const [baseline, setBaseline] = useState({
    googleAnalyticsId: initial?.googleAnalyticsId ?? "",
    googleTagManagerId: initial?.googleTagManagerId ?? "",
    metaPixelId: initial?.metaPixelId ?? "",
  });
  const hasChanges =
    googleAnalyticsId !== baseline.googleAnalyticsId ||
    googleTagManagerId !== baseline.googleTagManagerId ||
    metaPixelId !== baseline.metaPixelId;

  const saveAction = async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { googleAnalyticsId, googleTagManagerId, metaPixelId },
      });
      if (!res.success) throw new Error(res.error);
      setBaseline({
        googleAnalyticsId,
        googleTagManagerId,
        metaPixelId,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to save Analytics & Tracking" };
    }
  };

  return (
    <section id="analytics-tracking" className="space-y-4 pb-4">
      <div className="space-y-1">
        <Label htmlFor="googleAnalyticsId" className="text-xs">
          Google Analytics ID
        </Label>
        <Input
          id="googleAnalyticsId"
          value={googleAnalyticsId}
          placeholder="eg: UA-XXXXXX"
          onChange={(e) => setGoogleAnalyticsId(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="googleTagManagerId" className="text-xs">
          Google Tag Manager ID
        </Label>
        <Input
          id="googleTagManagerId"
          value={googleTagManagerId}
          placeholder="eg: GTM-XXXXXX"
          onChange={(e) => setGoogleTagManagerId(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="metaPixelId" className="text-xs">
          Meta Pixel ID
        </Label>
        <Input
          id="metaPixelId"
          value={metaPixelId}
          placeholder="eg: XXXXXX"
          onChange={(e) => setMetaPixelId(e.target.value)}
        />
      </div>

      <SaveButton websiteId={websiteId} hasChanges={hasChanges} saveAction={saveAction} />
    </section>
  );
}
