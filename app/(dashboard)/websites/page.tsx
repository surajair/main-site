import { getSites } from "@/actions/get-sites-actions";
import { getUser } from "@/actions/get-user-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Site } from "@/utils/types";
import { Globe, MoveRight, Plus, Star } from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function HomePage() {
  const user = await getUser();
  const data = await getSites(user.id, true);
  const sites: Site[] = data as Site[];

  return (
    <div className="h-full flex flex-col pt-4">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Websites</h1>
          <p className="text-muted-foreground">Manage your websites and create amazing content</p>
        </div>
        <Link href="/websites/add-new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add New Website
          </Button>
        </Link>
      </div>

      {sites.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {sites.map((site) => (
              <Card
                key={site.id}
                className="hover:border-primary/50 duration-300 transition-all cursor-pointer group shadow-none">
                <Link href={`/websites/website/${site.id}`}>
                  <CardHeader>
                    <CardTitle className="text-xl">{site.name}</CardTitle>
                    <span className="text-muted-foreground text-xs leading-tight">{formatDate(site.createdAt)}</span>
                    <CardDescription className="flex items-center gap-1">
                      {site.subdomain || site.domain ? (
                        <Globe className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4 opacity-0" />
                      )}
                      {site.subdomain || site.domain || ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-1">
                        <Badge key={site?.fallbackLang} variant="outline" className="text-[10px]">
                          <Star className="mr-1 w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />{" "}
                          {site?.fallbackLang?.toUpperCase()}
                        </Badge>
                        {site.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-[10px]">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                      <MoveRight className="duration-300 group-hover:text-primary group-hover:translate-x-1" />
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
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first website to get started</p>
            <Link href="/websites/add-new">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Site
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
