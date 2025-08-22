import UpdatePassword from "@/components/auth/update-password";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
  return (
    <div className="w-full flex flex-col items-center p-6 space-y-4">
      <div className="flex items-center space-x-4 w-full max-w-md">
        <Link href="/account/profile">
          <Button variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Profile
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Your Password</h2>
        <p className="text-sm text-gray-600 mb-6">Enter your new password below to update your account security.</p>
        <UpdatePassword type="change" redirectTo="/account/profile" />
      </div>
    </div>
  );
}
