import "@/app/app.css";
import { BrandLogo } from "@/components/branding";
import { getClientSettings } from "@/lib/getter";
import { getSession } from "@/lib/getter/users";
import { isEmpty } from "lodash";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Script from "next/script";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

export const generateMetadata = async () => {
  const clientSettings = await getClientSettings();
  return {
    title: `${clientSettings?.name} - Editor`,
    description: "Build and manage your websites with ease",
    icons: { icon: clientSettings?.favicon },
  };
};

/**
 *
 * @param param0
 * @description Render auth UI Layout
 *
 */
const WithAuthLayout = async ({ children, clientSettings }: { children: React.ReactNode; clientSettings: any }) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col-reverse lg:flex-row">
      {/* Left side - Link, Content */}
      <div
        className="hidden lg:flex w-1/2 h-screen flex-col justify-center items-center relative overflow-hidden"
        dangerouslySetInnerHTML={{ __html: clientSettings?.loginHtml }}
      />

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 h-full bg-background flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-4">
            <BrandLogo width={50} height={50} shouldRedirect={false} />
          </div>

          {children}

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our
            <Link href="/terms-and-conditions" className="text-primary hover:underline font-medium">
              {" "}
              Terms of Service
            </Link>{" "}
            and
            <Link href="/privacy-policy" className="text-primary hover:underline font-medium">
              {" "}
              Privacy Policy
            </Link>
          </p>

          <div className="mt-8 text-center">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary">
              Learn more about our platform
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * This layout is used to wrap the children in a layout that is used to
 * check if the user is authenticated. If the user is authenticated,
 * they will be redirected to the sites page. If the user is not
 * authenticated, they will be redirected to the login page.
 *
 * @param param0
 * @returns
 */
const LayoutContainer = async ({ children }: { children: React.ReactNode }) => {
  const clientSettings = await getClientSettings();
  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <style>{clientSettings?.theme}</style>
      </head>
      <body className={`${geist.className} antialiased`}>
        <Toaster richColors />
        <WithAuthLayout clientSettings={clientSettings}>{children}</WithAuthLayout>
        {!isEmpty(process.env.NEXT_PUBLIC_CLARITY_ID) ? (
          <Script
            id="chaibuilder-app-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
    `,
            }}
          />
        ) : null}
      </body>
    </html>
  );
};

/**
 * This layout is used to wrap the children in a layout that is used to
 * check if the user is authenticated. If the user is authenticated,
 * they will be redirected to the sites page. If the user is not
 * authenticated, they will be redirected to the login page.
 *
 * @param param0
 * @returns
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const headerList = await headers();
  const isResetPassword = headerList.get("x-redirection-type") === "reset-password";
  if (session) {
    if (isResetPassword) {
      // If reset-password, then open reset-password form in auth container else redirect to editor(/)
      return <LayoutContainer>{children}</LayoutContainer>;
    }
    redirect("/");
  } else if (isResetPassword) {
    // If reset-password is tried to access when not authenticated, then redirect to login
    redirect("/login");
  }

  return <LayoutContainer>{children}</LayoutContainer>;
}
