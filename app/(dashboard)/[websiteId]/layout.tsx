import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type React from "react";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    websiteId: string;
  }>;
}

export default async function ProjectLayout({ children }: ProjectLayoutProps) {
  try {
    return <div className="bg-background h-full flex flex-col">{children}</div>;
  } catch (error) {
    // Fallback UI in case of error
    return (
      <div className="bg-background h-full flex flex-col">
        <div className="p-8 flex-1 flex items-center justify-center">
          <div className="text-center max-w-xl">
            <h1 className="text-2xl font-bold text-destructive mb-4">Website not found</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              The website you are trying to access does not exist or has been deleted.
            </p>
            <Link
              href="/websites"
              className="inline-flex items-center gap-2 text-sm hover:bg-gray-200 px-2 py-1 rounded">
              <ArrowLeft className="h-4 w-4" /> Go Back to Websites
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
