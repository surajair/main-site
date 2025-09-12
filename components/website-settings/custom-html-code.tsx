"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteData } from "@/utils/types";

interface CustomHtmlProps {
  websiteId: string;
  data: SiteData;
  onChange?: (updates: any) => void;
}

export default function CustomHtmlCode({ websiteId, data, onChange }: CustomHtmlProps) {
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
          className="resize-none"
          value={data?.settings?.headHTML || ""}
          placeholder="<script>...</script> or <meta>...</meta> or <link>...</link>"
          onChange={(e) => 
            onChange?.({
              settings: {
                headHTML: e.target.value
              }
            })
          }
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
          className="resize-none"
          value={data?.settings?.footerHTML || ""}
          placeholder="<script>...</script> or other HTML elements"
          onChange={(e) => 
            onChange?.({
              settings: {
                footerHTML: e.target.value
              }
            })
          }
          rows={8}
        />
      </div>
    </section>
  );
}
