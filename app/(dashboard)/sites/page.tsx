import { getSites } from "@/actions/get-sites-actions";
import { getUser } from "@/actions/get-user-action";
import { CreateSite } from "@/components/dashboard/create-site";
import SiteCard from "@/components/dashboard/site-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Site } from "@/utils/types";
import Link from "next/link";

export default async function ChaibuilderWebsites() {
  const user = await getUser();
  const data = await getSites(user.id);
  const sites: Site[] = data as Site[];

  return (
    <div className="flex flex-col h-full">
      {!user?.user_metadata?.hasPassword && (
        <div className="w-full">
          <Alert variant="default">
            <AlertTitle className="text-lg font-semibold">Please set your password</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>
                Please set a your password to get started with Chai Builder. This will allow you to access visual
                builder on your site
              </p>
              <Link href="/update-password">
                <Button size="sm" variant="default">
                  Set password
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="mb-8 flex items-center justify-between sticky top-0 bg-white z-10 py-4">
          <h1 className="text-xl sm:text-3xl font-bold">Your Websites</h1>
          <CreateSite isSiteLimitReached={sites.length >= 12} />
        </div>

        {sites.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-semibold">No sites yet</h2>
              <p className="mb-6 text-muted-foreground">Create your first site to get started with Chai Builder</p>
              <div className="flex flex-col gap-4">
                <CreateSite isSiteLimitReached={false} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
            {sites.map((site, index) => (
              <SiteCard key={site.id} site={site} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
