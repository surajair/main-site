import "@/app/app.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type React from "react";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Builder",
  description: "Build and manage your websites with ease",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="ltr" className="h-full">
      <body className={`${geist.className} h-full antialiased`}>{children}</body>
    </html>
  );
}
