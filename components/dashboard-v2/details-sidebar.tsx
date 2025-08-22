"use client";

import { Globe, Key, Settings } from "lucide-react";
import type React from "react";

const sidebarItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "api-key", label: "API Key", icon: Key },
  { id: "domain", label: "Domain", icon: Globe },
  // { id: "usage", label: "Usage", icon: BarChart3 },
];

interface DetailsSidebarProps {
  onNavigate?: (targetId: string) => void;
}

function DetailsSidebar({ onNavigate }: DetailsSidebarProps) {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(targetId);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h2 className="text-lg font-playfair font-semibold text-sidebar-foreground">Website Details</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure your website</p>
      </div>

      <nav className="px-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleSmoothScroll(e, item.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

DetailsSidebar.displayName = "DetailsSidebar";

export default DetailsSidebar;
