"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Site } from "@/utils/types";
import { useFlag } from "@openfeature/react-sdk";
import { BookOpenText, Edit2, Globe, MoreVertical, MoveRight, Settings, Star } from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface WebsiteCardProps {
  site: Site;
}

export default function WebsiteCard({ site }: WebsiteCardProps) {
  const { value: websiteSettings } = useFlag("website_settings", false);
  return (
    <Card className="hover:border-primary/50 duration-300 transition-all group shadow-none relative overflow-hidden">
      {/* Always-visible Controls Layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Settings Menu - Top Right (Always visible) */}
        <div className="absolute top-2 right-2 pointer-events-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {websiteSettings && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:border hover:border-primary/20"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <MoreVertical className="h-3 w-3" />
                  <span className="sr-only">Open menu</span>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white cursor-pointer">
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/${site.id}/details`;
                }}
                className="cursor-pointer hover:bg-gray-100 text-xs font-medium">
                <Settings className="h-4 w-4" />
                Website Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/${site.id}/form-submission`;
                }}
                className="cursor-pointer hover:bg-gray-100 text-xs font-medium">
                <BookOpenText className="h-4 w-4" />
                Form Submissions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Link href={`/${site.id}/editor`}>
        {/* Hover-expand Editor Button - Bottom Right */}
        <div className="absolute bottom-2 right-2 pointer-events-auto">
          <button className="flex items-center gap-2 border border-transparent group-hover:border-border rounded-full h-max pl-3 group-hover:bg-primary duration-300">
            <span className="text-xs font-semibold leading-none text-primary group-hover:text-white group-hover:opacity-100 opacity-0 duration-300">
              Go to editor
            </span>
            <div className="rounded-full border border-transparent p-1.5 bg-white group-hover:border-primary duration-300">
              <MoveRight className="w-4 h-4 text-primary group-hover:hidden" />
              <Edit2 className="w-4 h-4 text-primary hidden group-hover:block" />
            </div>
          </button>
        </div>

        {/* Card Content */}
        <CardHeader>
          <CardTitle className="text-xl">{site.name}</CardTitle>
          <span className="text-muted-foreground text-xs leading-tight">{formatDate(site.createdAt)}</span>
          <CardDescription className="flex items-center gap-1 hover:text-primary">
            {site.subdomain || site.domain ? <Globe className="h-4 w-4" /> : <Globe className="h-4 w-4 opacity-0" />}
            <a
              href={`https://${site.subdomain || site.domain}`}
              className="leading-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`http://${site.subdomain || site.domain}`, "_blank");
              }}>
              {site.subdomain || site.domain || ""}
            </a>
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
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
