import { CrispChatWidget } from "@/components/crisp-chat-widget";
import { getClientSettings } from "@/lib/getter";
import { getSession } from "@/lib/getter/users";
import { isEmpty } from "lodash";
import { Geist } from "next/font/google";
import { redirect } from "next/navigation";
import Script from "next/script";
import "./builder.css";

const geist = Geist({ subsets: ["latin"], preload: true });

export const generateMetadata = async () => {
  const clientSettings = await getClientSettings();
  return {
    title: `${clientSettings?.name} - Editor`,
    description: "Build and manage your websites with ease",
    icons: { icon: clientSettings?.favicon },
  };
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
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
        <CrispChatWidget />
      </body>
    </html>
  );
}
