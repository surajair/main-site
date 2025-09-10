"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettingsContext } from ".";
import SaveButton from "./save-button";

interface AnalyticsTrackingProps {
  websiteId: string;
  initial?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    metaPixelId?: string;
    customTrackingScripts?: string[];
  };
}

export default function AnalyticsTracking({ websiteId, initial }: AnalyticsTrackingProps) {
  const { setHasUnsavedChanges } = useSettingsContext();

  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(initial?.googleAnalyticsId ?? "");
  const [googleTagManagerId, setGoogleTagManagerId] = useState(initial?.googleTagManagerId ?? "");
  const [metaPixelId, setMetaPixelId] = useState(initial?.metaPixelId ?? "");
  const [customTrackingScripts, setCustomTrackingScripts] = useState<string[]>(initial?.customTrackingScripts ?? []);
  const [scriptInput, setScriptInput] = useState("");

  const [baseline, setBaseline] = useState({
    googleAnalyticsId: initial?.googleAnalyticsId ?? "",
    googleTagManagerId: initial?.googleTagManagerId ?? "",
    metaPixelId: initial?.metaPixelId ?? "",
    customTrackingScripts: initial?.customTrackingScripts ?? [],
  });
  const hasChanges =
    googleAnalyticsId !== baseline.googleAnalyticsId ||
    googleTagManagerId !== baseline.googleTagManagerId ||
    metaPixelId !== baseline.metaPixelId ||
    JSON.stringify(customTrackingScripts) !== JSON.stringify(baseline.customTrackingScripts);

  // Update unsaved changes in context whenever hasChanges changes
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  const addScript = () => {
    const v = scriptInput.trim();
    if (!v) return;
    setCustomTrackingScripts((s) => [...s, v]);
    setScriptInput("");
  };
  const removeScript = (i: number) => setCustomTrackingScripts((s) => s.filter((_, idx) => idx !== i));

  const saveAction = async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { googleAnalyticsId, googleTagManagerId, metaPixelId, customTrackingScripts },
      });
      if (!res.success) throw new Error(res.error);
      setBaseline({
        googleAnalyticsId,
        googleTagManagerId,
        metaPixelId,
        customTrackingScripts: [...customTrackingScripts],
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to save Analytics & Tracking" };
    }
  };

  return (
    <section id="analytics-tracking" className="space-y-4">
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

      <div className="space-y-1">
        <Label className="text-xs">Custom tracking scripts</Label>
        <div className="flex items-start gap-2">
          <Textarea
            placeholder="<script>...</script> or a URL"
            value={scriptInput}
            onChange={(e) => setScriptInput(e.target.value)}
          />
          <Button
            size="icon"
            type="button"
            onClick={addScript}
            className="shrink-0"
            disabled={scriptInput?.trim().length < 3}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {customTrackingScripts.length > 0 && (
          <div className="space-y-2 pt-1">
            {customTrackingScripts.map((snip, i) => (
              <div key={i} className="flex items-center gap-2">
                <Textarea
                  value={snip}
                  onChange={(e) => setCustomTrackingScripts((s) => s.map((v, idx) => (idx === i ? e.target.value : v)))}
                />
                <Button type="button" variant="ghost" onClick={() => removeScript(i)} className="shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SaveButton hasChanges={hasChanges} saveAction={saveAction} />
    </section>
  );
}
