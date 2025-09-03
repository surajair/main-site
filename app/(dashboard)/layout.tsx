import "@/app/app.css";
import TopNavigation from "@/components/top-navigation";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/lib/getter/users";
import { FeatureFlagProvider } from "@/lib/openfeature/feature-flag-provider";
import { fetchFeatureFlags } from "@/lib/openfeature/server";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type React from "react";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Builder - Project Management",
  description: "Manage your website builder projects and settings",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const featureFlags = await fetchFeatureFlags("admin", "free");

  return (
    <html dir="ltr" className="smooth-scroll">
      <body className={`${geist.className} flex h-screen flex-col`}>
        <FeatureFlagProvider featureFlags={featureFlags}>
          <Toaster richColors theme="light" />
          <TopNavigation user={user} />
          <main className="flex-1 container h-[calc(100vh-4rem)] pb-2 overflow-hidden">{children}</main>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
