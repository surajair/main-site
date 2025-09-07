"use client";

import { BrandLogo, BrandName } from "@/components/branding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WebsiteSettingModal from "@/components/website-setting-modal";
import CreateNewWebsite from "@/components/website-setting-modal/create-new-website";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { getSites } from "@/lib/getter";
import { OpenFeatureProvider } from "@openfeature/react-sdk";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";
import { Loader, Plus } from "lucide-react";

const queryClient = new QueryClient();

const getPreviewUrl = (slug: string, domain?: string) => {
  return `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`;
};

const getLiveUrl = (slug: string, domain?: string) => {
  return `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`;
};

const Editor = ({ domain, websiteId }: { domain?: string; websiteId?: string }) => {
  const { data: websites, isFetching, refetch } = useQuery({ queryKey: ["websites-list"], queryFn: getSites });
  const isLoading = isFetching && !websites;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader className="animate-spin text-primary" />
      </div>
    );
  } else if (!isLoading) {
    if (websites?.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen w-screen">
          <Card className="flex flex-col items-center justify-center p-8">
            <div className="space-y-2 flex flex-col items-center">
              <BrandLogo shouldRedirect={false} />
              <BrandName />
            </div>
            <div className="text-center space-y-2 mb-4 mt-4">
              <h1 className="text-2xl font-semibold text-gray-900">Welcome </h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Get started by creating your first website. Build beautiful, responsive sites with our intuitive editor.
                Lets bring your vision to life.
              </p>
            </div>
            <br />
            <CreateNewWebsite totalSites={0}>
              <Button size="lg">
                <Plus className="h-4 w-4" />
                Create Your First Website
              </Button>
            </CreateNewWebsite>
          </Card>
        </div>
      );
    }
  }

  return (
    <ChaiBuilder
      apiUrl="editor/api"
      logo={() => (
        <WebsiteSettingModal websiteId={websiteId} websites={websites} isLoading={isLoading} refetch={refetch} />
      )}
      getPreviewUrl={(slug: string) => getPreviewUrl(slug, domain)}
      getLiveUrl={(slug: string) => getLiveUrl(slug, domain)}
    />
  );
};

export default function EditorWrapper({ domain, websiteId }: { domain?: string; websiteId?: string }) {
  const { ready } = useSupabaseUser();

  return ready ? (
    <OpenFeatureProvider>
      <QueryClientProvider client={queryClient}>
        <Editor domain={domain} websiteId={websiteId} />
      </QueryClientProvider>
    </OpenFeatureProvider>
  ) : null;
}
