import "@/app/(public)/site.css";

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
