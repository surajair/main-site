import { getSession } from "@/actions/get-user-action";
import "@/app/app.css";
import { BrandLogo, BrandName } from "@/components/dashboard-v2/branding";
import { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your Brand - Dashboard",
  description: "Build and manage your websites with ease",
};

/**
 *
 * @param param0
 * @description Render auth UI Layout
 *
 */
const WithAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col-reverse lg:flex-row">
      {/* Left side - Link, Content */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/95 p-8 lg:p-16 flex-col justify-center items-center lg:items-start relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo and brand */}
        <div className="relative z-10 flex items-center space-x-4 mb-12">
          <div className="border-2 rounded">
            <BrandLogo shouldRedirect={false} />
          </div>
          <h1 className="text-primary-foreground text-3xl font-bold uppercase leading-tight tracking-wide">
            <BrandName />
          </h1>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <h2 className="text-primary-foreground text-3xl xl:text-5xl font-bold mb-6 text-center lg:text-left">
            Build websites visually
            <br />
            with ease
          </h2>
          <p className="text-primary-foreground/70 text-lg xl:text-xl mb-8 max-w-xl hidden lg:flex">
            The ultimate website builder with AI-powered features, drag-and-drop editing, and instant publishing
            capabilities.
          </p>

          {/* Feature grid */}
          <div className="hidden xl:grid grid-cols-2 gap-4 max-w-xl">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background/10 backdrop-blur-sm rounded-lg p-4 flex items-start space-x-3 hover:shadow-xl duration-300">
                <div className="mt-0.5 text-primary-foreground">{feature.icon}</div>
                <div>
                  <h3 className="text-primary-foreground font-medium">{feature.title}</h3>
                  <p className="text-primary-foreground/70 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 h-full bg-background flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
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
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <html dir="ltr" className="smooth-scroll">
      <body className={`${geist.className} antialiased`}>
        <Toaster richColors />
        <WithAuthLayout>{children}</WithAuthLayout>
      </body>
    </html>
  );
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
