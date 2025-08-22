import { getSite } from "@/actions/get-site-action";
import { getUser } from "@/actions/get-user-action";
import AddDomainModal from "@/components/dashboard-v2/add-domain-modal";
import ApiKeySection from "@/components/dashboard-v2/api-key-section";
import DeleteWebsiteButton from "@/components/dashboard-v2/delete-website-button";
import WebsiteInformation from "@/components/dashboard-v2/website-information";
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

    return (
      <ScrollArea className="h-[85vh] px-8 scroll-smooth overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
        <WebsiteInformation websiteId={websiteId} siteData={siteData} />
        <ApiKeySection websiteId={websiteId} siteData={siteData} />
        <AddDomainModal websiteId={websiteId} siteData={siteData} />
        {/* <UsageAnalytics /> */}
        <DeleteWebsiteButton websiteId={websiteId} siteData={siteData} />
        <div className="h-48" />
      </ScrollArea>
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
