import { Button } from "@/components/ui/button";
import ProfileForm from "@/components/website-settings/profile-form";
import { getUser } from "@/lib/getter/users";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const user = await getUser();

  return (
    <div className="w-full flex flex-col items-center p-6 space-y-4">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Websites
          </Button>
        </Link>
        
        {/* Profile Dialog Trigger */}
        <ProfileForm user={user} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Profile Settings</h1>
          <p className="text-gray-600 mb-6">
            Click on your profile avatar in the top right to manage your account settings.
          </p>
          <div className="flex justify-center">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
