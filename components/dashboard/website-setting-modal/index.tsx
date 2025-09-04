"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getSite, getSiteData } from "@/lib/getter/sites";
import { getUser } from "@/lib/getter/users";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "chai-next";
import { Activity, BookOpenText, Globe, ImageIcon, Loader, Settings, Share2, Shield, ShieldCheck } from "lucide-react";
import { useState } from "react";
import AddDomainModal from "../add-domain-modal";
import AnalyticsTracking from "../website-settings/analytics-tracking";
import Branding from "../website-settings/branding";
import ContactSocial from "../website-settings/contact-social";
import General from "../website-settings/general";
import LegalCompliance from "../website-settings/legal-compliance";
import SpamProtection from "../website-settings/spam-protection";

interface WebsiteSettingsContentProps {
  websiteId: string;
}

const sidebarItems = [
  { id: "general", label: "General", icon: Settings, component: General },
  { id: "domain", label: "Domain", icon: Globe, component: AddDomainModal },
  { id: "branding", label: "Branding", icon: ImageIcon, component: Branding },
  { id: "contact-social", label: "Contact & Social", icon: Share2, component: ContactSocial },
  { id: "legal-compliance", label: "Legal Compliance", icon: ShieldCheck, component: LegalCompliance },
  { id: "spam-protection", label: "Spam Protection", icon: Shield, component: SpamProtection },
  { id: "analytics-tracking", label: "Analytics Tracking", icon: Activity, component: AnalyticsTracking },
  {
    id: "form-submission",
    label: "Form submissions",
    icon: BookOpenText,
    component: () => <div>Form Submissions</div>,
  },
];

function WebsiteSettingsContent({ websiteId }: WebsiteSettingsContentProps) {
  const [activeTab, setActiveTab] = useState("general");
  const { data, isLoading } = useQuery({
    queryKey: ["website-settings", websiteId],
    queryFn: async () => {
      const user = await getUser();
      const siteData = await getSite(user.id, websiteId);
      const initialData = await getSiteData(websiteId);
      return { siteData, initialData };
    },
    enabled: !!websiteId, // Only fetch when websiteId is available
    initialData: { siteData: {} as any, initialData: {} as any },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 min-h-[60vh]">
        <Loader className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const activeItem = sidebarItems.find((item) => item.id === activeTab);
  const Icon = activeItem?.icon;
  const Component = activeItem?.component;

  return (
    <div className="flex">
      <div className="w-52 h-full bg-sidebar border-r border-sidebar-border pr-2">
        <h2 className="text-lg font-playfair font-semibold text-sidebar-foreground px-2">Website Settings</h2>

        <nav className="pt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <>
                {item.id === "form-submission" && <Separator key={`${item.id}-separator`} className="my-2" />}
                <Button
                  key={item.id}
                  className="w-full flex justify-start"
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(item.id)}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </>
            );
          })}
        </nav>
      </div>
      <div className="flex-1">
        <ScrollArea
          className="h-[calc(100vh-10rem)] scroll-smooth overflow-y-auto px-8"
          style={{ scrollBehavior: "smooth" }}>
          <div className="flex items-center gap-x-2">
            {Icon && <Icon className="h-5 w-5" />}
            <h2 className="font-semibold">{activeItem?.label}</h2>
          </div>
          {Component && <Component websiteId={websiteId} initial={data.initialData} siteData={data.siteData as any} />}
        </ScrollArea>
      </div>
    </div>
  );
}

export default function WebsiteSettingModal({ websiteId }: { websiteId: string | undefined }) {
  const [open, setOpen] = useState(false);

  return (
    websiteId && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings />
            <span className="sr-only">Settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-7xl max-h-[80vh] overflow-y-auto h-[60vh]"
          onInteractOutside={(e) => e.preventDefault()}>
          {open && <WebsiteSettingsContent websiteId={websiteId} />}
        </DialogContent>
      </Dialog>
    )
  );
}
