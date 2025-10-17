import "@/app/app.css";
import { ChaiClarity } from "@/components/chai-clarity";
import { CrispChatWidget } from "@/components/crisp-chat-widget";
import { Toaster } from "@/components/ui/sonner";
import { getClientSettings } from "@/lib/getter";
import { getSession } from "@/lib/getter/users";
import { FeatureFlagProvider } from "@/lib/openfeature/feature-flag-provider";
import { Geist } from "next/font/google";
import { redirect } from "next/navigation";
import type React from "react";

const geist = Geist({ subsets: ["latin"] });

export const generateMetadata = async () => {
  const clientSettings = await getClientSettings();
  return {
    title: `${clientSettings?.name} - Editor`,
    description: "Build and manage your websites with ease",
    icons: { icon: clientSettings?.favicon },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const clientSettings = await getClientSettings();
  if (!session) redirect("/login");
  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <style>{clientSettings?.theme}</style>
      </head>
      <body className={`${geist.className} flex h-screen flex-col`}>
        <FeatureFlagProvider fromDashboard={true}>
          <Toaster richColors theme="light" />
          <main className="flex-1 bg-primary container h-[calc(100vh-4rem)] pb-2 overflow-hidden">{children}</main>
        </FeatureFlagProvider>
        <ChaiClarity />
        <CrispChatWidget />
      </body>
    </html>
  );
}
