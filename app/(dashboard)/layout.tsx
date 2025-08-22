import { getUser } from "@/actions/get-user-action";
import "@/app/app.css";
import { UserProfile } from "@/components/dashboard/user-profile";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Your Brand - Dashboard",
  description: "Manage your Your Brand projects",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html dir="ltr" className="smooth-scroll">
      <body className="font-body antialiased">
        <div className="flex h-screen flex-col">
          <header className="border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo shouldRedirect={false} />
                <span className="ml-2 text-xl font-bold tracking-wide uppercase">Your Brand</span>
              </div>
              <UserProfile user={user} />
            </div>
          </header>
          <div className="container flex-1 h-full">{children}</div>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
