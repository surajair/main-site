import "@/app/(public)/site.css";
import { getClientSettings } from "@/lib/getter";
import ChaiBuilder from "chai-next/server";

ChaiBuilder.init(process.env.CHAIBUILDER_APP_ID!);

export const generateMetadata = async () => {
  const clientSettings = await getClientSettings();
  return {
    title: `${clientSettings?.name}`,
    description: clientSettings?.name,
    icons: { icon: clientSettings?.favicon },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
