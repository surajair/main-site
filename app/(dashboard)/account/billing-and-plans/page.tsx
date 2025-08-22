import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center p-6 space-y-4">
      <div className="flex items-center space-x-4 w-full max-w-2xl">
        <Link href="/websites">
          <Button variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Websites
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Billing & Plans</h1>
        
        <div>
          <p className="text-gray-600 text-lg mb-2">
            Add your billing and plan here
          </p>
          <p className="text-sm text-gray-500">
            Configure your payment provider and subscription plans in this section.
          </p>
        </div>
      </div>
    </div>
  );
}
