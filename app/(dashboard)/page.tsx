import CreateNewWebsite from "@/components/dashboard/create-new-website";
import GoToWebsite from "@/components/dashboard/go-to-website";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSites } from "@/lib/getter/sites";
import { getUser } from "@/lib/getter/users";
import { Site } from "@/utils/types";
import { Edit, Globe, MoveRight, Plus, Star } from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ProcessedSite extends Site {
  formattedDate: string;
  displayUrl: string;
  hasUrl: boolean;
}

export default async function HomePage() {
  const user = await getUser();
  const data = await getSites(user.id, true);
  const sites: Site[] = data as Site[];

  // Process sites data on server-side
  const processedSites: ProcessedSite[] = sites?.map((site) => ({
    ...site,
    formattedDate: formatDate(site.createdAt),
    displayUrl: site.subdomain || site.domain || "",
    hasUrl: !!(site.subdomain || site.domain),
  }));

  return (
    <div className="h-full flex flex-col py-8">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold mb-2">Your Websites</h1>
        </div>
        <CreateNewWebsite totalSites={sites.length}>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add New Website
          </Button>
        </CreateNewWebsite>
      </div>

      {processedSites.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {processedSites.map((site) => (
              <Card
                key={site.id}
                className="hover:border-primary/50 duration-300 transition-all group shadow-none relative overflow-hidden">
                <Link href={`/${site.id}/editor`}>
                  {/* Hover-expand Editor Button - Bottom Right */}
                  <div className="absolute right-2 bottom-2 group-hover:bg-primary/10 duration-300 pointer-events-auto flex items-center justify-center">
                    <Button
                      variant="default"
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg duration-300 shadow-xl hover:bg-primary/95 px-6">
                      <Edit /> Open in Editor
                    </Button>
                  </div>
                  <MoveRight className="absolute right-2 bottom-2 text-primary group-hover:opacity-0 transition-opacity mr-2" />

                  {/* Card Content */}
                  <CardHeader>
                    <CardTitle className="text-xl">{site.name}</CardTitle>
                    <span className="text-muted-foreground text-xs leading-tight">{site.formattedDate}</span>
                    <CardDescription className="flex items-center gap-1 hover:text-primary">
                      {site.hasUrl ? <Globe className="h-4 w-4" /> : <Globe className="h-4 w-4 opacity-0" />}
                      <GoToWebsite displayUrl={site?.displayUrl} />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-1">
                        <Badge key={site?.fallbackLang} variant="outline" className="text-[10px]">
                          <Star className="mr-1 w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />{" "}
                          {site?.fallbackLang?.toUpperCase()}
                        </Badge>
                        {site?.languages?.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-[10px]">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No sites yet</h3>
            <p className="text-muted-foreground mb-6">Create your first website to get started</p>
            <CreateNewWebsite totalSites={processedSites.length}>
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
