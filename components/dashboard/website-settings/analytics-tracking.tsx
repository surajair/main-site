"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Loader, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

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
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(initial?.googleAnalyticsId ?? "");
  const [googleTagManagerId, setGoogleTagManagerId] = useState(initial?.googleTagManagerId ?? "");
  const [metaPixelId, setMetaPixelId] = useState(initial?.metaPixelId ?? "");
  const [customTrackingScripts, setCustomTrackingScripts] = useState<string[]>(initial?.customTrackingScripts ?? []);
  const [scriptInput, setScriptInput] = useState("");

  const addScript = () => {
    const v = scriptInput.trim();
    if (!v) return;
    setCustomTrackingScripts((s) => [...s, v]);
    setScriptInput("");
  };
  const removeScript = (i: number) => setCustomTrackingScripts((s) => s.filter((_, idx) => idx !== i));

  const [state, saveAll, saving] = useActionState(async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { googleAnalyticsId, googleTagManagerId, metaPixelId, customTrackingScripts },
      });
      if (!res.success) throw new Error(res.error);
      toast.success("Analytics & Tracking saved");
      return { success: true };
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Analytics & Tracking");
      return { success: false };
    }
  }, null);

  return (
    <section id="analytics-tracking" className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h2 className=" font-semibold">Analytics & Tracking</h2>
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
          <CardDescription>Analytics IDs and extra tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
              <Input
                id="googleTagManagerId"
                value={googleTagManagerId}
                onChange={(e) => setGoogleTagManagerId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
              <Input id="metaPixelId" value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Custom tracking scripts</Label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="<script>...</script> or a URL"
                  value={scriptInput}
                  onChange={(e) => setScriptInput(e.target.value)}
                />
                <Button type="button" variant="secondary" onClick={addScript} className="shrink-0">
                  Add
                </Button>
              </div>
              {customTrackingScripts.length > 0 && (
                <div className="space-y-2 pt-1">
                  {customTrackingScripts.map((snip, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Textarea
                        value={snip}
                        onChange={(e) =>
                          setCustomTrackingScripts((s) => s.map((v, idx) => (idx === i ? e.target.value : v)))
                        }
                      />
                      <Button type="button" variant="ghost" onClick={() => removeScript(i)} className="shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
