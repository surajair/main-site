"use client";

import WebsiteSettingModal from "@/components/dashboard/website-setting-modal";
import { Button } from "@/components/ui/button";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";
import { useRouter } from "next/navigation";

const LogoAndBack = () => {
  const router = useRouter();
  console.log("##");

  return (
    <Button
      variant={"ghost"}
      onClick={() => router.push("/")}
      className="flex items-center gap-1 hover:bg-transparent hover:text-primary p-1">
      <svg width="800" height="800" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 11H5.41l5.3-5.29a1 1 0 1 0-1.42-1.42l-7 7a1.2 1.2 0 0 0-.21.33.94.94 0 0 0 0 .76 1.2 1.2 0 0 0 .21.33l7 7a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42L5.41 13H21a1 1 0 0 0 0-2"
          fill="currentColor"
        />
      </svg>
      <p className="">Back</p>
    </Button>
  );
};

const queryClient = new QueryClient();

export default function Editor({ domain, websiteId }: { domain?: string; websiteId?: string }) {
  const { ready } = useSupabaseUser();

  return ready ? (
    <QueryClientProvider client={queryClient}>
      <ChaiBuilder
        logo={() => <WebsiteSettingModal websiteId={websiteId} />}
        apiUrl="editor/api"
        getPreviewUrl={(slug: string) =>
          `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
        }
        getLiveUrl={(slug: string) =>
          `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
        }
      />
    </QueryClientProvider>
  ) : null;
}
