"use client";

import { BookOpenText, Globe, Key, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

const sidebarItems = [
  { id: "form-submission", label: "Form submission", icon: BookOpenText },
  { id: "general", label: "General", icon: Settings },
  { id: "api-key", label: "API Key", icon: Key },
  { id: "domain", label: "Domain", icon: Globe },
];

interface DetailsSidebarProps {
  onNavigate?: (targetId: string) => void;
}

function DetailsSidebar({ onNavigate }: DetailsSidebarProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    // Update active hash when hash changes
    const updateHash = () => {
      setActiveHash(window.location.hash.replace("#", ""));
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    if (pathname.includes("/form-submission")) {
      setActiveHash("form-submission");
    } else {
      setActiveHash("general");
    }
  }, [pathname]);

  useEffect(() => {
    handleSmoothScroll(activeHash);
  }, [activeHash]);

  const handleSmoothScroll = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const isActive = (itemId: string) => {
    if (itemId === "form-submission") {
      return pathname.includes("/form-submission");
    }
    return false;
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

          const active = isActive(item.id);
          const baseClasses =
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
          const activeClasses = active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-sidebar-foreground hover:bg-gray-100 hover:text-gray-900";

          // Form submission gets its own route, others navigate to details page with hash
          if (item.id === "form-submission") {
            return (
              <>
                <Link
                  onClick={() => setActiveHash("form-submission")}
                  key={item.id}
                  href={`form-submission`}
                  className={`${baseClasses} ${activeClasses}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>

                <Separator className="my-2" />
              </>
            );
          }

          return (
            <Link key={item.id} href={`details#${item.id}`} className={`${baseClasses} ${activeClasses}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

DetailsSidebar.displayName = "DetailsSidebar";

export default DetailsSidebar;
