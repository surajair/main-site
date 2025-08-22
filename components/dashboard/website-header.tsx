"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Site } from "@/utils/types";

interface WebsiteHeaderProps {
  projectName: string;
  siteData: Site;
}

const getCurrentPageName = (pathname: string) => {
  if (pathname.includes("/submissions")) return "Submissions";
  if (pathname.includes("/blogs/new")) return "New Blog";
  if (pathname.includes("/blogs") && pathname.includes("/edit")) return "Edit Blog";
  if (pathname.includes("/blogs")) return "Blogs";
  if (pathname.includes("/details")) return "Details";
  return "Dashboard";
};

export function WebsiteHeader({ projectName, siteData }: WebsiteHeaderProps) {
  const pathname = usePathname();

  const defaultDomain = useMemo(() => {
    // Show domain if available and configured, otherwise show subdomain
    if (siteData.domain && siteData.domainConfigured) {
      return siteData.domain;
    }
    return siteData.subdomain;
  }, [siteData]);

  return (
    <div className="border-b bg-card">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center">
          <Link href="/websites">
            <Button variant="ghost" size="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Websites
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-foreground transition-colors font-extrabold text-primary">{projectName}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{getCurrentPageName(pathname)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {defaultDomain && (
            <div className="text-right flex items-center gap-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <a
                href={`https://${defaultDomain}`}
                target="_blank"
                className="text-xs text-blue-500 hover:text-blue-800 flex items-center gap-x-1">
                {defaultDomain}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
