import type { Metadata } from "next";
import "./public.css";


export const metadata: Metadata = {
  title: "Chai Builder",
  description: "Chai Builder",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ hostname: string; slug: string[] }>
}>) {
  console.log("RootLayout params:", await params);
  return (
    <html className={`smooth-scroll`}>
      <body className={`font-body antialiased`}>{children}</body>
    </html>
  );
}
