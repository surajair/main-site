"use client";

import { Button } from "@/components/ui/button";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import ChaiBuilder from "chai-next";
import { startsWith } from "lodash";
import { useRouter } from "next/navigation";

const LogoAndBack = () => {
  const router = useRouter();
  return (
    <Button variant={"ghost"} onClick={() => router.push("/")} className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-left-icon lucide-arrow-left">
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      <p className="font-bold">Back</p>
    </Button>
  );
};

export default function Editor({ domain }: { domain?: string }) {
  const { ready } = useSupabaseUser();

  return ready ? (
    <ChaiBuilder
      logo={LogoAndBack}
      apiUrl="editor/api"
      getPreviewUrl={(slug: string) =>
        `//${domain}/api/preview?slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
      }
      getLiveUrl={(slug: string) =>
        `//${domain}/api/preview?disable=true&slug=${startsWith(slug, "/") ? slug : "/_partial/" + slug}`
      }
    />
  ) : null;
}
