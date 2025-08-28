import "@/app/app.css";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Your Brand - Project Management",
  description: "Manage your Your Brand projects and settings",
  generator: "chaibuilder.com",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
