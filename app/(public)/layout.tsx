import "@/app/(public)/site.css";
import ChaiBuilder from "chai-next/server";

ChaiBuilder.init(process.env.CHAIBUILDER_APP_ID!);

export const generateMetadata = async () => {
  return {
    title: "ChaiBuilder",
    description: "ChaiBuilder",
    icons: { icon: "https://placehold.co/52x52" },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
