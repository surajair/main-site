"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteData } from "@/utils/types";

interface AnalyticsTrackingProps {
  websiteId: string;
  data: SiteData;
  onChange?: (updates: any) => void;
}

export default function AnalyticsTracking({ websiteId, data, onChange }: AnalyticsTrackingProps) {
  return (
    <section id="analytics-tracking" className="space-y-4 pb-4">
      <div className="space-y-1">
        <Label htmlFor="googleAnalyticsId" className="text-xs">
          Google Analytics ID
        </Label>
        <Input
          id="googleAnalyticsId"
          value={data?.settings?.googleAnalyticsId || ""}
          placeholder="eg: UA-XXXXXX"
          onChange={(e) =>
            onChange?.({
              settings: {
                googleAnalyticsId: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="googleTagManagerId" className="text-xs">
          Google Tag Manager ID
        </Label>
        <Input
          id="googleTagManagerId"
          value={data?.settings?.googleTagManagerId || ""}
          placeholder="eg: GTM-XXXXXX"
          onChange={(e) =>
            onChange?.({
              settings: {
                googleTagManagerId: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="metaPixelId" className="text-xs">
          Meta Pixel ID
        </Label>
        <Input
          id="metaPixelId"
          value={data?.settings?.metaPixelId || ""}
          placeholder="eg: XXXXXX"
          onChange={(e) =>
            onChange?.({
              settings: {
                metaPixelId: e.target.value,
              },
            })
          }
        />
      </div>
    </section>
  );
}
