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
const WithAuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const clientSettings = await getClientSettings();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col-reverse lg:flex-row">
      {/* Left side - Link, Content */}
      <div
        className="hidden lg:flex w-1/2 h-screen flex-col justify-center items-center relative overflow-hidden"
        dangerouslySetInnerHTML={{
          __html: clientSettings?.loginHtml,
        }}
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
const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <html dir="ltr" className="smooth-scroll">
      <head>
        <link rel="stylesheet" href={`/${process.env.APP_DOMAIN?.replace(":", ".")}.css`} />
      </head>
      <body className={`${geist.className} antialiased`}>
        <Toaster richColors />
        <WithAuthLayout>{children}</WithAuthLayout>
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

// Feature items with icons
const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    title: "Visual Builder",
    description: "Build with drag & drop",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Deploy",
    description: "Publish with one click",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    title: "Smart Features",
    description: "AI-powered tools",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    title: "Version Control",
    description: "Track all changes",
  },
];
