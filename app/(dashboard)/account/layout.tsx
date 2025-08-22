import { getUser } from "@/actions/get-user-action";
import "@/app/app.css";
import TopNavigation from "@/components/top-navigation";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Your Brand - Project Management",
  description: "Manage your Your Brand projects and settings",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <body>
      <TopNavigation user={user} />
      <main className="h-full py-4">{children}</main>
    </body>
  );
}
