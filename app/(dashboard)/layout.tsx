import "@/app/app.css";
import { Toaster } from "@/components/ui/sonner";
import TopNavigation from "@/components/websites-dashboard/top-navigation";
import { getUser } from "@/lib/getter/users";
import { FeatureFlagProvider } from "@/lib/openfeature/feature-flag-provider";
import { fetchFeatureFlags } from "@/lib/openfeature/server";
import { getBrandConfig } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type React from "react";

const geist = Geist({ subsets: ["latin"] });

const brandConfig = getBrandConfig();

export const metadata: Metadata = {
  title: "Website Builder - Project Management",
  description: "Manage your website builder projects and settings",
  icons: {
    icon: brandConfig.favicon || "/favicon.ico",
  },
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
      <head>
        <link rel="icon" href={brandConfig.favicon} />
        <title>{brandConfig.name}</title>
        <link rel="stylesheet" href={`/${process.env.APP_DOMAIN}.css`} />
      </head>
      <body className={`${geist.className} flex h-screen flex-col`}>
        <FeatureFlagProvider featureFlags={featureFlags}>
          <Toaster richColors theme="light" />
          <TopNavigation user={user} />
          <main className="flex-1 bg-primary container h-[calc(100vh-4rem)] pb-2 overflow-hidden">{children}</main>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
