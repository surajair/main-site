import { BrandLogo, BrandName } from "@/components/branding";
import LogoutButton from "@/components/logout-button";
import QueryClientProviderWrapper from "@/components/providers/query-client-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CreateNewWebsite from "@/components/website-settings/create-new-website";
import { getSites, Sites } from "@/lib/getter/sites";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  CircleArrowOutUpRight,
  Eye,
  Layers,
  MoveRight,
  Plus,
  Settings2,
  Sparkle,
  User,
} from "lucide-react";
import Link from "next/link";

export default async function HomePage({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  const data = await getSites();
  const sites: Sites[] = data as Sites[];
  const hasSites = sites?.length > 0;
  if (!websiteId) {
    return (
      <div className="w-screen h-screen fixed inset-0 bg-white">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-auto p-6 bg-white">
            <div className="text-center mb-6 flex flex-col items-center space-y-2">
              <BrandLogo />
              <BrandName className="text-primary" />
              <div className={`text-center ${!hasSites ? "pt-8" : "pt-2"}`}>
                <span className="text-lg font-bold mb-2">
                  {hasSites ? "Select website to start building" : "Welcome"}
                </span>
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
        </div>
        <div className="h-12 w-full bg-white border-b flex items-center px-2 gap-2">
          <BrandLogo />
          <BrandName />
        </div>
        <div className="h-[calc(100%-48px)] w-full bg-white border-b flex">
          <div className="w-12 h-full border-r flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 flex items-center justify-center">
                <Sparkle className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="w-10 h-10 flex items-center justify-center">
                <CircleArrowOutUpRight className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="w-96 h-full border-r px-3">
            <div className="no-scrollbar h-max flex items-center justify-between">
              <div className="flex h-10 items-center space-x-1 text-base font-bold ">
                <span>Outline</span>
              </div>
              <div className="flex items-center gap-x-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                <ChevronsDownUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
          </div>

          <div className="w-full h-full" />
          <div className="w-96 h-full border-l">
            <div className="space-y-4 rounded-xl p-4 text-muted-foreground mt-8 flex items-center flex-col">
              <Settings2 />
              <h1 className="text-center">Please select a block to edit settings or styles</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // redirect(`/${websiteId}/editor`);
}
