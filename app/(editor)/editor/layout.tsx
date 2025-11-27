import { Geist } from "next/font/google";
import "./builder.css";

const geist = Geist({ subsets: ["latin"], preload: true });

export const generateMetadata = async () => {
  return {
    title: "Chai Builder - Editor",
    description: "Build and manage your websites with ease",
  };
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
