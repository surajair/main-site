"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getSite, getSiteData } from "@/lib/getter/sites";
import { getUser } from "@/lib/getter/users";
import { useQuery } from "@tanstack/react-query";
import { Activity, BookOpenText, Globe, ImageIcon, Loader, Settings, Share2, Shield, ShieldCheck } from "lucide-react";
import { createContext, useContext, useState } from "react";
import AnalyticsTracking from "./analytics-tracking";
import BrandingConfiguration from "./branding-configuration";
import ContactSocial from "./contact-social";
import DomainConfiguration from "./domain-configuration";
import FormSubmissions from "./form-submissions";
import General from "./general";
import LegalCompliance from "./legal-compliance";
import SpamProtection from "./spam-protection";

// Context for managing unsaved changes across settings components
interface SettingsContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }
  return context;
}

const sidebarItems = [
  {
    id: "form-submission",
    label: "Form submissions",
    icon: BookOpenText,
    component: FormSubmissions,
  },
  { id: "general", label: "General", icon: Settings, component: General },
  { id: "domain", label: "Domain", icon: Globe, component: DomainConfiguration },
  { id: "branding", label: "Branding", icon: ImageIcon, component: BrandingConfiguration },
  { id: "contact-social", label: "Contact & Social", icon: Share2, component: ContactSocial },
  { id: "legal-compliance", label: "Legal Compliance", icon: ShieldCheck, component: LegalCompliance },
  { id: "spam-protection", label: "Spam Protection", icon: Shield, component: SpamProtection },
  { id: "analytics-tracking", label: "Analytics Tracking", icon: Activity, component: AnalyticsTracking },
];

export default function WebsiteSettingModal({ websiteId }: { websiteId: string | undefined }) {
  const [open, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasUnsavedChanges) {
      // If trying to close with unsaved changes, show confirmation dialog
      setShowConfirmDialog(true);
    } else {
      setOpen(newOpen);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setOpen(false);
    setHasUnsavedChanges(false);
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  return (
    websiteId && (
      <>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings />
              <span className="sr-only">Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-5xl overflow-y-auto"
            style={{ height: "80vh", maxHeight: "860px" }}
            onInteractOutside={(e) => e.preventDefault()}>
            {open && <WebsiteSettingsContentWrapper websiteId={websiteId} onUnsavedChanges={setHasUnsavedChanges} />}
          </DialogContent>
        </Dialog>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to close without saving?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelClose}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmClose}>Close without saving</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  );
}

// Wrapper to pass unsaved changes state up to the modal
function WebsiteSettingsContentWrapper({
  websiteId,
  onUnsavedChanges,
}: {
  websiteId: string;
  onUnsavedChanges: (hasChanges: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [hasUnsavedChanges, setHasUnsavedChangesInternal] = useState(false);
  const [showTabChangeDialog, setShowTabChangeDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["website-settings", websiteId],
    queryFn: async () => {
      const user = await getUser();
      const siteData = await getSite(user.id, websiteId);
      const initialData = await getSiteData(websiteId);
      return { siteData, initialData };
    },
    enabled: !!websiteId,
    initialData: null,
  });

  const setHasUnsavedChanges = (value: boolean) => {
    setHasUnsavedChangesInternal(value);
    onUnsavedChanges(value);
  };

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges && newTab !== activeTab) {
      // If there are unsaved changes, show confirmation dialog
      setPendingTabChange(newTab);
      setShowTabChangeDialog(true);
    } else {
      // No unsaved changes, switch immediately
      setActiveTab(newTab);
    }
  };

  const handleConfirmTabChange = () => {
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
    }
    setShowTabChangeDialog(false);
    setPendingTabChange(null);
    setHasUnsavedChanges(false);
  };

  const handleCancelTabChange = () => {
    setShowTabChangeDialog(false);
    setPendingTabChange(null);
  };

  const settingsContextValue = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
  };

  const activeItem = sidebarItems.find((item) => item.id === activeTab);
  const Icon = activeItem?.icon;
  const Component = activeItem?.component;

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <div className="flex overflow-hidden">
        <div className="w-52 h-full bg-sidebar border-r border-sidebar-border pr-2">
          <h2 className="font-semibold text-sidebar-foreground px-2">Website Settings</h2>
          <div className="text-xs font-medium px-2 text-primary">{data?.siteData?.name}</div>

          <nav className="pt-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              return (
                <>
                  <Button
                    key={item.id}
                    size="sm"
                    disabled={isLoading}
                    className="w-full flex justify-start"
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => handleTabChange(item.id)}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                  {item.id === "form-submission" && <Separator key={`${item.id}-separator`} className="my-2" />}
                </>
              );
            })}
          </nav>
        </div>
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-x-2 pb-4 px-6">
              {Icon && <Icon className="h-5 w-5" />}
              <h2 className="font-semibold">{activeItem?.label}</h2>
            </div>
            <div
              className="h-full scroll-smooth overflow-y-auto px-6 no-scrollbar"
              style={{ scrollBehavior: "smooth" }}>
              {Component && (
                <Component websiteId={websiteId} initial={data.initialData.data} siteData={data.siteData as any} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tab Change Confirmation Dialog */}
      <AlertDialog open={showTabChangeDialog} onOpenChange={setShowTabChangeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the current tab. Are you sure you want to switch tabs without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTabChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTabChange}>Switch without saving</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsContext.Provider>
  );
}
