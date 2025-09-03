import { getSites } from "@/lib/getter/sites";
import { getUser } from "@/lib/getter/users";
import CreateNewWebsite from "@/components/dashboard/create-new-website";
import WebsiteCard from "@/components/dashboard/website-card";
import { Button } from "@/components/ui/button";
import { getFeatureFlag } from "@/lib/openfeature/server";
import { Site } from "@/lib/getter/sites";
import { Globe, Plus } from "lucide-react";

export default async function HomePage() {
  const user = await getUser();
  const data = await getSites(user.id, true);
  const sites: Site[] = data as Site[];
  const isCreateSite = await getFeatureFlag("create_site", false);

  return (
    <div className="h-full flex flex-col py-8">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold mb-2">Your Websites</h1>
        </div>
        <CreateNewWebsite totalSites={sites.length}>
          <Button size="lg" className="gap-2" disabled={!isCreateSite}>
            <Plus className="h-5 w-5" />
            Add New Website
          </Button>
        </CreateNewWebsite>
      </div>

      {sites.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {sites.map((site) => (
              <WebsiteCard key={site.id} site={site} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No sites yet</h3>
            <p className="text-muted-foreground mb-6">Create your first website to get started</p>
            <CreateNewWebsite totalSites={sites.length}>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Site
              </Button>
            </CreateNewWebsite>
          </div>
        </div>
      )}
    </div>
  );
}
