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
import { getSite } from "@/lib/getter";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "chai-next";
import {
  Activity,
  BookOpenText,
  Globe,
  ImageIcon,
  ListChecks,
  Loader,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import AnalyticsTracking from "./analytics-tracking";
import BrandingConfiguration from "./branding-configuration";
import ContactSocial from "./contact-social";
import CreateNewWebsite from "./create-new-website";
import DeleteWebsite from "./delete-website";
import DomainConfiguration from "./domain-configuration";
import FormSubmissions from "./form-submissions";
import General from "./general";
import LegalCompliance from "./legal-compliance";
import SpamProtection from "./spam-protection";

// Reusable Unsaved Changes Dialog Component
interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
}

function UnsavedChangesDialog({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  title = "Unsaved Changes",
  description = "You have unsaved changes. Are you sure you want to continue without saving?",
  confirmText = "Continue without saving",
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

const SIDEBAR_ITEMS = [
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

// Wrapper to pass unsaved changes state up to the modal
function WebsiteSettingsContent({
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

  const { data: siteData, isLoading } = useQuery({
    queryKey: ["website-settings", websiteId],
    queryFn: async () => getSite(websiteId),
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

  const activeItem = SIDEBAR_ITEMS.find((item) => item.id === activeTab);
  const Icon = activeItem?.icon;
  const Component = activeItem?.component;

  if (isLoading || !siteData) {
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
          <div className="text-xs font-medium px-2 text-primary">{siteData?.name}</div>

          <nav className="pt-6">
            {SIDEBAR_ITEMS.map((item) => {
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
              {Component && <Component websiteId={websiteId} initial={siteData?.data} siteData={siteData as any} />}
            </div>
          </div>
        )}
      </div>

      {/* Tab Change Confirmation Dialog */}
      <UnsavedChangesDialog
        open={showTabChangeDialog}
        onOpenChange={setShowTabChangeDialog}
        onCancel={handleCancelTabChange}
        onConfirm={handleConfirmTabChange}
        description="You have unsaved changes in the current tab. Are you sure you want to switch tabs without saving?"
        confirmText="Switch without saving"
      />
    </SettingsContext.Provider>
  );
}

const WebsitesPopoverContent = ({
  websiteId,
  websites,
  isLoading,
  refetch,
}: {
  websiteId: string;
  websites: any;
  isLoading: boolean;
  refetch: () => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 h-80 w-96">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-96 max-h-[40vh] flex flex-col">
      {/* Fixed Header */}
      <CardHeader className="py-4 border-b">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Your Website</span>
          <span className="text-muted-foreground">{websites?.length} websites</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 max-h-96 overflow-y-auto space-y-2 rounded-lg p-4">
        {websites?.map((site: any) => (
          <div key={site.id} className="group relative overflow-hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="right" className="w-32">
                <DeleteWebsite websiteId={site.id} websiteName={site.name} onDeleted={refetch} />
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href={`/${site?.id}/editor`} className="block p-3 rounded-md border hover:bg-muted transition-colors">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium text-sm ${websiteId === site.id ? "text-primary" : ""}`}>{site.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </CardContent>

      {/* Fixed Footer */}
      <CardFooter className="flex-shrink-0 p-3 border-t bg-white">
        <CreateNewWebsite totalSites={websites?.length || 0}>
          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4" />
            Add New Website
          </Button>
        </CreateNewWebsite>
      </CardFooter>
    </Card>
  );
};

export default function WebsiteSettingModal({
  websiteId,
  websites,
  isLoading,
  refetch,
}: {
  websiteId: string | undefined;
  websites: any;
  isLoading: boolean;
  refetch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showWebsiteList, setShowWebsiteList] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasUnsavedChanges) {
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

  const hasWebsites = !isLoading && websites && websites?.length > 0;

  return (
    <>
      <div className="flex items-center border rounded-md p-0 h-9 px-px">
        <Popover open={showWebsiteList || !websiteId || !hasWebsites} onOpenChange={setShowWebsiteList}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ListChecks />
              <span className="sr-only">Website manager</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            className={`ml-2 p-0 border rounded-xl border-primary/30 shadow-2xl overflow-hidden w-96`}>
            <WebsitesPopoverContent
              websiteId={websiteId || ""}
              websites={websites}
              isLoading={isLoading}
              refetch={refetch}
            />
          </PopoverContent>
        </Popover>
        {websiteId && (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="p-0 w-8 h-8">
                <Settings />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-5xl overflow-y-auto"
              style={{ height: "80vh", maxHeight: "860px" }}
              onInteractOutside={(e) => e.preventDefault()}>
              {open && <WebsiteSettingsContent websiteId={websiteId} onUnsavedChanges={setHasUnsavedChanges} />}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <UnsavedChangesDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onCancel={handleCancelClose}
        onConfirm={handleConfirmClose}
        description="You have unsaved changes. Are you sure you want to close without saving?"
        confirmText="Close without saving"
      />
    </>
  );
}
