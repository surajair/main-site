import { getUser } from "@/actions/get-user-action";
import "@/app/(public)/public.css";
import { Clarity } from "@/components/clarity";
import { UserProfile } from "@/components/dashboard/user-profile";
import { Logo } from "@/components/logo";
import { registerFonts } from "@/fonts";
import { GoogleTagManager } from "@next/third-parties/google";
import { FontsAndStyles } from "chai-next/blocks/rsc";
import ChaiBuilder from "chai-next/server";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { SalesIQ } from "../SalesIQ";

ChaiBuilder.init(process.env.CHAIBUILDER_API_KEY!);

registerFonts();

export const metadata: Metadata = {
  title: "Chaibuilder - Websites",
  description: "Manage your Chaibuilder websites",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <FontsAndStyles />
      </head>
      <body className="font-body antialiased">
        <div className="flex h-screen flex-col">
          <header className="border-b bg-white">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo shouldRedirect={false} />
                <span className="ml-2 text-xl font-bold tracking-wide uppercase">Chai Builder</span>
              </div>
              <UserProfile user={user} />
            </div>
          </header>
          <div className="container flex-1 h-full">{children}</div>
        </div>
        <Toaster richColors />
        <Clarity />
        {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
        <SalesIQ />
      </body>
    </html>
  );
}
