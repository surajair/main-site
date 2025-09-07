import { BrandLogo, BrandName } from "@/components/branding";
import { Card } from "@/components/ui/card";
import { getSites } from "@/lib/getter/sites";
import { Site } from "@/utils/types";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  const data = await getSites();
  const sites: Site[] = data as Site[];

  if (!websiteId) {
    return (
      <div className="w-screen h-screen fixed inset-0 bg-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto p-6 bg-white">
          <div className="text-center mb-6 flex flex-col items-center space-y-2">
            <BrandLogo />
            <BrandName />
            <h2 className="text-2xl font-bold mb-2">Select Website to Start</h2>
            <p className="text-muted-foreground">Choose a website to open in the builder</p>
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2 rounded-lg p-4">
            {sites?.map((site) => (
              <Link
                key={site.id}
                href={`/${site.id}/editor`}
                className="block p-3 rounded-md border hover:bg-muted transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{site.name}</h3>
                  <MoveRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  redirect(`/${websiteId}/editor`);
}
