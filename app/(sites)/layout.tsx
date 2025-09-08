import "@/app/(sites)/site.css";
import { getBrandConfig } from "@/lib/utils";
import type { Metadata } from "next";

const brandConfig = getBrandConfig();

export const metadata: Metadata = {
  title: brandConfig.name || "Chai Builder",
  description: "Chai Builder",
  icons: {
    icon: brandConfig.favicon || "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html className={`smooth-scroll`}>{children}</html>;
}
