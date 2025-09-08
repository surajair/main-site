import { BrandLogo, BrandName } from "@/components/branding";
import { Card } from "@/components/ui/card";
import { getSites } from "@/lib/getter/sites";
import { Site } from "@/utils/types";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  CircleArrowOutUpRight,
  Eye,
  Layers,
  MoveRight,
  Settings2,
  Sparkle,
  User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  const data = await getSites();
  const sites: Site[] = data as Site[];

  if (!websiteId) {
    return (
      <div className="w-screen h-screen fixed inset-0 bg-white">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
        <div className="h-12 w-full bg-white border-b flex items-center px-2 gap-2">
          <BrandLogo />
          <BrandName />
        </div>
        <div className="h-[calc(100%-48px)] w-full bg-white border-b flex">
          <div className="w-12 h-full border-r flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 flex items-center justify-center">
                <Sparkle className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="w-10 h-10 flex items-center justify-center">
                <CircleArrowOutUpRight className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="w-96 h-full border-r px-3">
            <div className="no-scrollbar h-max flex items-center justify-between">
              <div className="flex h-10 items-center space-x-1 text-base font-bold ">
                <span>Outline</span>
              </div>
              <div className="flex items-center gap-x-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                <ChevronsDownUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
            <div className="w-full h-5 bg-gray-100 mt-2" />
          </div>

          <div className="w-full h-full" />
          <div className="w-96 h-full border-l">
            <div className="space-y-4 rounded-xl p-4 text-muted-foreground mt-8 flex items-center flex-col">
              <Settings2 />
              <h1 className="text-center">Please select a block to edit settings or styles</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  redirect(`/${websiteId}/editor`);
}
