import "@/app/app.css";
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
  if (!session) redirect("/login");
  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <link rel="stylesheet" href={`/${process.env.APP_DOMAIN?.replace(":", ".")}.css`} />
      </head>
      <body className={`${geist.className} flex h-screen flex-col`}>
        <FeatureFlagProvider>
          <Toaster richColors theme="light" />
          <main className="flex-1 bg-primary container h-[calc(100vh-4rem)] pb-2 overflow-hidden">{children}</main>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
