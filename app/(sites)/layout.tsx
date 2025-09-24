import "@/app/(sites)/site.css";
import { getClientSettings } from "@/lib/getter";

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
