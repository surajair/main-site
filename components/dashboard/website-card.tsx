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
import { FileText, Globe, MoreVertical, MoveRight, Settings, Star } from "lucide-react";
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
  return (
    <Card className="hover:border-primary/50 duration-300 transition-all group shadow-none relative overflow-hidden">
      {/* Always-visible Controls Layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Settings Menu - Top Right (Always visible) */}
        <div className="absolute top-2 right-2 pointer-events-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white border border-primary/20"
                onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white cursor-pointer">
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/${site.id}/details`;
                }}
                className="cursor-pointer hover:bg-gray-100">
                <Settings className="h-4 w-4 mr-2" />
                Website Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/${site.id}/form-submission`;
                }}
                className="cursor-pointer hover:bg-gray-100">
                <FileText className="h-4 w-4 mr-2" />
                Form Submissions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Hover-expand Editor Button - Bottom Right */}
        <div className="absolute bottom-2 right-2 pointer-events-auto">
          <Link href={`/${site.id}/editor`}>
            <button
              className={`
                relative flex items-center justify-start h-[40px]
                text-white font-roboto cursor-pointer overflow-hidden
                transition-all duration-200 ease-in-out
                bg-primary/80 hover:bg-primary border-none
                ${"rounded-full group-hover:pr-2 group-hover:pl-0"}
              `}>
              {/* Short Icon */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <MoveRight className="w-4 h-4 text-white" />
              </span>

              {/* Long Text */}
              <span
                className={`
                  ml-10 group-hover:ml-9 whitespace-nowrap
                  transition-all duration-200
                  ${"opacity-0 text-[0px] w-0 group-hover:opacity-100 group-hover:text-sm group-hover:w-auto"}
                `}>
                Go to Editor
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <CardHeader>
        <CardTitle className="text-xl">{site.name}</CardTitle>
        <span className="text-muted-foreground text-xs leading-tight">{formatDate(site.createdAt)}</span>
        <CardDescription onClick={
          () => {
            window.open(`https://${site.subdomain || site.domain}`, "_blank");
          }
        } className="flex items-center gap-1 hover:cursor-pointer hover:text-blue-500 transition-colors">
          {site.subdomain || site.domain ? <Globe className="h-4 w-4" /> : <Globe className="h-4 w-4 opacity-0" />}
          {site.subdomain || site.domain || ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <Badge key={site?.fallbackLang} variant="outline" className="text-[10px]">
              <Star className="mr-1 w-2.5 h-2.5 text-yellow-500 fill-yellow-500" /> {site?.fallbackLang?.toUpperCase()}
            </Badge>
            {site.languages.map((lang) => (
              <Badge key={lang} variant="outline" className="text-[10px]">
                {lang.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
