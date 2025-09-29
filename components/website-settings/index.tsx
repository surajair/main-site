"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useClientSettings } from "@/hooks/use-client-settings";
import { useWebsites } from "@/hooks/use-websites";
import { getSite } from "@/lib/getter";
import { SiteData } from "@/utils/types";
import { useFlag } from "@openfeature/react-sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger, useSavePage } from "chai-next";
import { omit } from "lodash";
import {
  Activity,
  ChevronDown,
  Code,
  ExternalLinkIcon,
  Globe,
  ImageIcon,
  Loader,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import AnalyticsTracking from "./analytics-tracking";
import BrandingConfiguration from "./branding-configuration";
import ContactSocial from "./contact-social";
import CreateNewWebsite from "./create-new-website";
import CustomHtml from "./custom-html-code";
import DeleteWebsite from "./delete-website";
import DomainConfiguration from "./domain-configuration";
import General from "./general";
import LegalCompliance from "./legal-compliance";
import SaveButton from "./save-button";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

const SIDEBAR_ITEMS = [
  { id: "general", label: "General", icon: Settings, component: General },
  { id: "branding", label: "Branding", icon: ImageIcon, component: BrandingConfiguration },
  { id: "contact-social", label: "Contact & Social", icon: Share2, component: ContactSocial },
  { id: "legal-compliance", label: "Cookie Consent", icon: ShieldCheck, component: LegalCompliance },
  { id: "analytics-tracking", label: "Analytics Tracking", icon: Activity, component: AnalyticsTracking },
  { id: "custom-html", label: "Custom HTML", icon: Code, component: CustomHtml },
  { id: "domain", label: "Domains", icon: Globe, component: DomainConfiguration },
];

/**
 * Website settings content component
 * @param params websiteId
 */
function WebsiteSettingsContent({
  websiteId,
  initData,
  setInitData,
  isDataChange,
  setIsDataChange,
}: {
  websiteId: string;
  initData: any;
  setInitData: (value: any) => void;
  isDataChange: boolean;
  setIsDataChange: (value: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [showTabChangeDialog, setShowTabChangeDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const handleGetSiteData = async () => {
    const siteData = await getSite(websiteId);
    setInitData(siteData);
    return siteData;
  };

  const { data: siteData, isLoading } = useQuery<SiteData | null>({
    queryKey: ["website-settings", websiteId],
    queryFn: async () => (await handleGetSiteData()) as any,
    enabled: !!websiteId,
    initialData: null,
    refetchOnWindowFocus: false,
  });

  const updateSiteDataLocally = (updates: Partial<SiteData>) => {
    queryClient.setQueryData(["website-settings", websiteId], (prevData: SiteData) => {
      return prevData
        ? {
            ...prevData,
            ...omit(updates, "settings"),
            ...{ settings: { ...(prevData.settings || {}), ...(updates?.settings || {}) } },
          }
        : prevData;
    });
  };

  useEffect(() => {
    if (!siteData || !initData) return;
    const isDataChanged = JSON.stringify(siteData) !== JSON.stringify(initData);
    setIsDataChange(isDataChanged);
  }, [siteData, initData, setIsDataChange]);

  const handleTabChange = (newTab: string) => {
    if (isDataChange && newTab !== activeTab) {
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
    updateSiteDataLocally(initData);
    setShowTabChangeDialog(false);
    setPendingTabChange(null);
    setIsDataChange(false);
  };

  const handleCancelTabChange = () => {
    setShowTabChangeDialog(false);
    setPendingTabChange(null);
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
    <>
      <div className="flex overflow-hidden">
        <div className="w-52 h-full bg-sidebar border-r border-sidebar-border pr-2">
          <h2 className="font-semibold text-sidebar-foreground px-2 pt-1">Website Settings</h2>
          <div className="text-xs text-primary px-2">{siteData?.name}</div>
          {siteData?.domainConfigured && siteData?.domain && (
            <a
              href={`https://${siteData?.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light px-2 text-blue-500 hover:text-blue-800 flex items-center gap-1 truncate">
              <span className="truncate">{siteData?.domain}</span>
              <ExternalLinkIcon className="h-2.5 w-2.5 flex-shrink-0" />
            </a>
          )}
          <a
            href={`https://${siteData?.subdomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-light px-2 text-blue-500 hover:text-blue-800 flex items-center gap-1 truncate">
            <span className="truncate">{siteData?.subdomain}</span>
            <ExternalLinkIcon className="h-2.5 w-2.5 flex-shrink-0" />
          </a>

          <nav className="pt-6">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isDomainItem = item.id === "domain";

              return (
                <div key={item.id}>
                  {isDomainItem && <Separator className="my-2" />}
                  <Button
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => handleTabChange(item.id)}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </div>
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
            <div className="flex items-center justify-between gap-x-2 pb-4 px-6">
              <div className="flex items-center gap-x-2">
                {Icon && <Icon className="h-5 w-5" />}
                <h2 className="font-semibold">{activeItem?.label}</h2>
              </div>
            </div>
            <div
              className="h-full scroll-smooth overflow-y-auto px-6 no-scrollbar"
              style={{ scrollBehavior: "smooth" }}>
              <ErrorBoundary
                fallback={<div className="text-center text-red-500 p-10">Something went wrong, Please try again</div>}>
                {Component && <Component data={siteData} websiteId={websiteId} onChange={updateSiteDataLocally} />}
              </ErrorBoundary>
              <div className="h-16" />
            </div>

            {Component && (
              <div className="px-6 border-t pt-4 flex items-center gap-x-4">
                <SaveButton
                  data={siteData}
                  websiteId={websiteId}
                  hasChanges={isDataChange}
                  showSave={!["branding", "domain"].includes(activeItem?.id)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab Change Confirmation Dialog */}
      <UnsavedChangesDialog
        open={showTabChangeDialog}
        onOpenChange={setShowTabChangeDialog}
        onCancel={handleCancelTabChange}
        onConfirm={handleConfirmTabChange}
        description="You have unsaved changes. Are you sure you want to switch tabs without saving?"
        confirmText="Switch without saving"
      />
    </>
  );
}

/**
 * Website settings modal component
 * @param params websiteId
 */
const WebsiteSettingsModal = ({ websiteId, isLoading }: { websiteId: string | undefined; isLoading: boolean }) => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { value: showWebsiteSettings } = useFlag("website_settings", false);
  const { savePageAsync } = useSavePage();
  const [isDataChange, setIsDataChange] = useState(false);
  const [initData, setInitData] = useState<any>(null);
  const queryClient = useQueryClient();
  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) savePageAsync();
    if (!newOpen && isDataChange) setShowConfirmDialog(true);
    else setShowModal(newOpen);
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setShowModal(false);
    setIsDataChange(false);
    if (!initData) return;
    queryClient.setQueryData(["website-settings", websiteId], () => initData);
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  if (!websiteId || !showWebsiteSettings) return null;
  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="p-0 w-8 h-8" disabled={true}>
        <Settings />
        <span className="sr-only">Settings</span>
      </Button>
    );
  }

  return (
    <>
      <Dialog open={showModal} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="p-0 w-8 h-8">
            <Settings />
            <span className="sr-only">Settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-5xl overflow-y-auto"
          style={{ height: "60vh", maxHeight: "860px" }}
          onInteractOutside={(e) => e.preventDefault()}
          aria-describedby="website-settings-description">
          <DialogTitle className="sr-only">Website Settings</DialogTitle>
          {showModal && (
            <WebsiteSettingsContent
              initData={initData}
              websiteId={websiteId}
              setInitData={setInitData}
              isDataChange={isDataChange}
              setIsDataChange={setIsDataChange}
            />
          )}
        </DialogContent>
      </Dialog>

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
};

/**
 * Websites popover content component
 * @param params websiteId, websites, isLoading, refetch
 */
const WebsitesPopoverContent = ({
  websiteId,
  websites,
  isLoading,
}: {
  websiteId: string;
  websites: any;
  isLoading: boolean;
}) => {
  const { value: canCreateSite } = useFlag("create_site", false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 h-80 w-96">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-96 flex flex-col">
      {/* Fixed Header */}
      <CardHeader className="p-2 px-4 border-b">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Your Website</span>
          <span className="text-muted-foreground font-light">{websites?.length} websites</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 max-h-96 overflow-y-auto space-y-2 rounded-lg p-2">
        {websites?.map((site: any) => (
          <div key={site.id} className="group relative overflow-hidden cursor-pointer">
            {canCreateSite && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side="right">
                  <DeleteWebsite websiteId={site.id} websiteName={site.name} />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div
              onClick={() => (window.location.href = `/${site?.id}/editor`)}
              className="px-3 py-1 group-hover:bg-muted rounded">
              <div className={`font-medium text-sm ${websiteId === site.id ? "text-primary" : ""}`}>{site.name}</div>
              <div className="text-xs text-muted-foreground">{site.subdomain}</div>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Fixed Footer */}
      {canCreateSite && (
        <CardFooter className="flex-shrink-0 p-3 border-t bg-white">
          <CreateNewWebsite totalSites={websites?.length || 0}>
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4" />
              Add New Website
            </Button>
          </CreateNewWebsite>
        </CardFooter>
      )}
    </Card>
  );
};

/**
 * Websites list popover component
 * @param params websites, websiteId, isLoading
 */
const WebsitesListPopover = ({
  websites,
  websiteId,
  isLoading,
}: {
  websites: any;
  isLoading: boolean;
  websiteId: string | undefined;
}) => {
  const { savePageAsync } = useSavePage();
  const [showWebsiteList, setShowWebsiteList] = useState(false);
  const open = showWebsiteList || !websiteId || (isLoading ? false : websites?.length === 0);

  const onOpenChange = async (open: boolean) => {
    if (open) savePageAsync();
    setShowWebsiteList(open);
  };

  const website = useMemo(() => websites?.find((site: any) => site?.id === websiteId), [websites, websiteId]);

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className="h-8" disabled={true}>
        <span className="text-xs">Loading</span>
        <ChevronDown />
        <span className="sr-only">Website manager</span>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <span className="text-xs">{website?.name}</span>
          <ChevronDown />
          <span className="sr-only">Website manager</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        alignOffset={-12}
        className={`ml-2 p-0 border rounded-xl border-border shadow-2xl overflow-hidden w-96`}>
        <WebsitesPopoverContent websiteId={websiteId || ""} websites={websites} isLoading={isLoading} />
      </PopoverContent>
    </Popover>
  );
};

/**
 *
 * Website settings component
 * @param params websiteId, websites, isLoading
 */
function WebsiteSettings({ websiteId }: { websiteId: string | undefined }) {
  const { data: clientSettings, isFetching: isFetchingClientSettings } = useClientSettings();
  const { data: websites, isFetching: isFetchingWebsites } = useWebsites();
  const router = useRouter();

  useEffect(() => {
    if (isFetchingClientSettings || isFetchingWebsites) return;
    const isActiveWebsite = websites?.find((site) => site?.id === websiteId);
    if (!isActiveWebsite) router.push(`/`);
  }, [websiteId, websites, isFetchingClientSettings, isFetchingWebsites, router]);

  return (
    <div className="flex items-center gap-x-2">
      {!isFetchingClientSettings && clientSettings?.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={clientSettings?.logo} width={32} height={32} alt="brand-logo" className="rounded-md" />
      ) : (
        <div className="w-8 h-8 rounded-md" />
      )}
      {!isFetchingWebsites && (
        <div className="flex items-center border rounded-md p-0 h-9 px-px">
          <WebsitesListPopover websiteId={websiteId} isLoading={isFetchingWebsites} websites={websites} />
          <WebsiteSettingsModal websiteId={websiteId} isLoading={isFetchingWebsites} />
        </div>
      )}
    </div>
  );
}

export default function WebsiteSettingsWrapper({ websiteId }: { websiteId: string | undefined }) {
  return <WebsiteSettings websiteId={websiteId} />;
}
