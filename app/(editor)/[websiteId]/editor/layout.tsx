import { ChaiClarity } from "@/components/chai-clarity";
import { CrispChatWidget } from "@/components/crisp-chat-widget";
import { getClientSettings } from "@/lib/getter";
import { getSession } from "@/lib/getter/users";
import { Geist } from "next/font/google";
import { redirect } from "next/navigation";
import "./builder.css";

const geist = Geist({ subsets: ["latin"], preload: true });

export const generateMetadata = async () => {
  const clientSettings = await getClientSettings();
  return {
    title: `${clientSettings?.name} - Editor`,
    description: "Build and manage your websites with ease",
    icons: { icon: clientSettings?.favicon },
  };
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
        <ChaiClarity />
        <CrispChatWidget />
      </body>
    </html>
  );
}
