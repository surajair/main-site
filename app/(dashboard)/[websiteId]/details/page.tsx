import { getSite } from "@/actions/get-site-action";
import { getUser } from "@/actions/get-user-action";
import { getWebsiteData } from "@/actions/get-website-data-action";
import AddDomainModal from "@/components/dashboard/add-domain-modal";
import DeleteWebsiteButton from "@/components/dashboard/delete-website-button";
import WebsiteInformation from "@/components/dashboard/website-information";
import AnalyticsTracking from "@/components/dashboard/website-settings/analytics-tracking";
import Branding from "@/components/dashboard/website-settings/branding";
import ContactSocial from "@/components/dashboard/website-settings/contact-social";
import LegalCompliance from "@/components/dashboard/website-settings/legal-compliance";
import SeoMetadata from "@/components/dashboard/website-settings/seo-metadata";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface WebsiteDetailsPageProps {
  params: Promise<{
    websiteId: string;
  }>;
}

export default async function WebsiteDetailsPage({ params }: WebsiteDetailsPageProps) {
  const { websiteId } = await params;

  try {
    const user = await getUser();
    const siteData = await getSite(user.id, websiteId);
    const initialData = await getWebsiteData(websiteId);

    return (
      <div className="flex-1">
        <ScrollArea
          className="h-[calc(100vh-10rem)] scroll-smooth overflow-y-auto space-y-5"
          style={{ scrollBehavior: "smooth" }}>
          <WebsiteInformation websiteId={websiteId} siteData={siteData} initialData={initialData.data} />
          {/* <ApiKeySection websiteId={websiteId} siteData={siteData} /> */}
          <AddDomainModal websiteId={websiteId} siteData={siteData} />
          <Branding websiteId={websiteId} initial={initialData.data} />
          <ContactSocial websiteId={websiteId} initial={initialData.data} />
          <LegalCompliance websiteId={websiteId} initial={initialData.data} />
          <SeoMetadata websiteId={websiteId} initial={initialData.data} />
          <AnalyticsTracking websiteId={websiteId} initial={initialData.data} />
          {/* <UsageAnalytics /> */}
          <DeleteWebsiteButton websiteId={websiteId} siteData={siteData} />
          <div className="h-48" />
        </ScrollArea>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error Loading Website Details</h1>
          <p className="text-muted-foreground mt-2">Unable to load website data. Please try again later.</p>
        </div>
      </div>
    );
  }
}
