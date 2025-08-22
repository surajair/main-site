import DetailsSidebar from "@/components/dashboard-v2/details-sidebar";
import type React from "react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 h-full flex">
      <DetailsSidebar />
      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
