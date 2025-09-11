"use client";

import { updateWebsiteData } from "@/actions/update-website-setting";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useSettingsContext } from ".";
import SaveButton from "./save-button";

interface CustomHtmlProps {
  websiteId: string;
  initial?: {
    headHTML?: string;
    footerHTML?: string;
  };
}

export default function CustomHtmlCode({ websiteId, initial }: CustomHtmlProps) {
  const { setHasUnsavedChanges } = useSettingsContext();

  const [headHTML, setHeadHTML] = useState(initial?.headHTML ?? "");
  const [footerHTML, setFooterHTML] = useState(initial?.footerHTML ?? "");

  const [baseline, setBaseline] = useState({
    headHTML: initial?.headHTML ?? "",
    footerHTML: initial?.footerHTML ?? "",
  });

  const hasChanges =
    headHTML !== baseline.headHTML ||
    footerHTML !== baseline.footerHTML;

  // Update unsaved changes in context whenever hasChanges changes
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges, setHasUnsavedChanges]);

  const saveAction = async () => {
    try {
      const res = await updateWebsiteData({
        id: websiteId,
        updates: { headHTML, footerHTML },
      });
      if (!res.success) throw new Error(res.error);
      setBaseline({
        headHTML,
        footerHTML,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to save Custom HTML" };
    }
  };

  return (
    <section id="custom-html" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="headHTML" className="text-xs">
          Head HTML
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Add custom HTML that will be inserted into the &lt;head&gt; section of your website
        </p>
        <Textarea
          id="headHTML"
          value={headHTML}
          placeholder="<script>...</script> or <meta>...</meta> or <link>...</link>"
          onChange={(e) => setHeadHTML(e.target.value)}
          rows={8}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="footerHTML" className="text-xs">
          Footer HTML
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Add custom HTML that will be inserted before the closing &lt;/body&gt; tag
        </p>
        <Textarea
          id="footerHTML"
          value={footerHTML}
          placeholder="<script>...</script> or other HTML elements"
          onChange={(e) => setFooterHTML(e.target.value)}
          rows={8}
        />
      </div>

      <SaveButton websiteId={websiteId} hasChanges={hasChanges} saveAction={saveAction} />
    </section>
  );
}
