"use client";

import {
  Activity,
  BookOpenText,
  Globe,
  Image as ImageIcon,
  Search,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "chai-next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

const sidebarItems = (t: any) => [
  { id: "form-submission", label: t("Form submissions"), icon: BookOpenText },
  { id: "general", label: t("General"), icon: Settings },
  // { id: "api-key", label: t("API Key"), icon: Key },
  { id: "domain", label: t("Domain"), icon: Globe },
  { id: "branding", label: t("Branding"), icon: ImageIcon },
  { id: "contact-social", label: t("Contact & Social"), icon: Share2 },
  { id: "legal-compliance", label: t("Cookie Consent"), icon: ShieldCheck },
  { id: "spam-protection", label: t("Spam Protection"), icon: Shield },
  { id: "seo-metadata", label: t("SEO Metadata"), icon: Search },
  { id: "analytics-tracking", label: t("Analytics Tracking"), icon: Activity },
];

interface DetailsSidebarProps {
  onNavigate?: (targetId: string) => void;
}

function DetailsSidebar({ onNavigate }: DetailsSidebarProps) {
  const { t } = useTranslation();
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
        <h2 className="text-lg font-playfair font-semibold text-sidebar-foreground">{t("Website Details")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("Configure your website")}</p>
      </div>

      <nav className="px-3">
        {sidebarItems(t).map((item) => {
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
              <div key={item.id}>
                <Link
                  onClick={() => setActiveHash("form-submission")}
                  key={item.id}
                  href={`form-submission`}
                  className={`${baseClasses} ${activeClasses}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>

                <Separator key={`${item.id}-separator`} className="my-2" />
              </div>
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
