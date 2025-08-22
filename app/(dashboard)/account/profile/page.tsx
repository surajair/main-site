import { getUser } from "@/actions/get-user-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const user = await getUser();

  // Extract user info with fallbacks
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const email = user.email || "";

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
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>
        
        {/* User Profile Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Avatar className="h-16 w-16 border-2 text-xl bg-gray-100">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || ""} />
            <AvatarFallback>{user?.user_metadata?.name?.charAt(0) || displayName.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <input
                type="text"
                value={displayName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
            </div>
            <Link
              href="/account/change-password"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Change Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
