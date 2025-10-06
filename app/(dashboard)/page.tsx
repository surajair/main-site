import { BrandLogo, BrandName } from "@/components/branding";
import LogoutButton from "@/components/logout-button";
import PlaceholderBuilderUI from "@/components/providers/placeholder-builder-ui";
import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CreateNewWebsite from "@/components/website-settings/create-new-website";
import { getSites, Sites } from "@/lib/getter/sites";
import { MoveRight, Plus } from "lucide-react";
import Link from "next/link";

export default async function HomePage({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  const data = await getSites();
  const sites: Sites[] = data as Sites[];
  const hasSites = sites?.length > 0;

  return (
    <PlaceholderBuilderUI brandLogo={<BrandLogo />} brandName={<BrandName />}>
      <Card className="w-full max-w-md mx-auto p-6 bg-white">
        <div className="text-center mb-6 flex flex-col items-center space-y-2">
          <BrandLogo />
          <BrandName className="text-primary" />
          <div className={`text-center ${!hasSites ? "pt-8" : "pt-2"}`}>
            <span className="text-lg font-bold mb-2">{hasSites ? "Select website to start building" : "Welcome"}</span>
            <p className="text-muted-foreground text-sm font-light">
              {hasSites
                ? "Choose a website to open in the builder"
                : "Create your first website and start building something amazing"}
            </p>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2 rounded-lg p-4">
          {sites && sites.length > 0
            ? sites.map((site: any) => (
                <Link
                  key={site.id}
                  href={`/${site?.id}/editor`}
                  className="border group px-3 py-1 hover:bg-muted rounded hover:text-primary flex items-center justify-between">
                  <div>
                    <div className={`font-medium text-sm ${websiteId === site.id ? "text-primary" : ""}`}>
                      {site.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{site.subdomain}</div>
                  </div>
                  <div>
                    <MoveRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                </Link>
              ))
            : null}
          <div className="text-center">
            <QueryClientProviderWrapper>
              <CreateNewWebsite totalSites={sites.length}>
                <Button
                  className={hasSites ? "my-4 w-fit border" : "w-full"}
                  variant={!hasSites ? "default" : "secondary"}>
                  <Plus className="h-4 w-4 mr-2" />
                  {hasSites ? "Create New Website" : "Create Your First Website"}
                </Button>
              </CreateNewWebsite>
            </QueryClientProviderWrapper>
          </div>
        </div>

        <div className="w-full flex justify-center pt-2 border-t">
          <LogoutButton variant="ghost" />
        </div>
      </Card>
    </PlaceholderBuilderUI>
  );
}
