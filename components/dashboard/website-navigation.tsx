"use client";

import { FileText, PenTool, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { id: "formSubmissions", label: "Form Submissions", icon: FileText, href: "/formSubmissions" },
  { id: "details", label: "Details", icon: Settings, href: "/details" },
  // { id: "blogs", label: "Blogs", icon: PenTool, href: "/blogs" },
];

interface WebsiteNavigationProps {
  websiteId: string;
}

export function WebsiteNavigation({ websiteId }: WebsiteNavigationProps) {
  const pathname = usePathname();

  // return null;
  return (
    <div className="px-8">
      <nav className="flex space-x-8 my-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const href = `/websites/website/${websiteId}${item.href}`;
          const isActive = pathname === href || (pathname.startsWith(href) && href !== "/website/" + websiteId);

          return (
            <Link
              key={item.id}
              href={href}
              className={`flex items-center gap-2 px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
