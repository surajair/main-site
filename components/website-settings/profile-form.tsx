"use client";

import { updateUserProfile } from "@/actions/update-profile-action";
import UpdatePassword from "@/components/auth/update-password";
import LogoutButton from "@/components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useSavePage } from "chai-next";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ProfileName({ initialName }: { initialName: string }) {
  const [fullName, setFullName] = useState(initialName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    setHasChanges(value !== initialName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !hasChanges) return;

    setIsUpdating(true);
    try {
      await updateUserProfile(fullName.trim());
      toast.success("Profile updated successfully");
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <Input
          type="text"
          value={fullName}
          onChange={handleNameChange}
          placeholder="Enter your full name"
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating || fullName === initialName} className="px-6">
          {isUpdating ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </>
          ) : (
            "Update Name"
          )}
        </Button>
      </div>
    </form>
  );
}

// Change Password Modal Component
const ChangePasswordModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-primary/80 text-white rounded-md hover:bg-primary transition-colors">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your new password below. Make sure it&apos;s at least 8 characters long.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UpdatePassword close={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Avatar trigger component that opens the profile dialog
const ProfileAvatarTrigger = ({ user }: { user: any }) => {
  const displayName = user.user_metadata?.full_name;

  return (
    <div className="flex items-center justify-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
      <Avatar className="h-9 w-9 border-2 border-border">
        <AvatarImage
          src={user.user_metadata?.avatar_url || "https://avatar.iran.liara.run/public/boy"}
          alt={user.user_metadata?.full_name || ""}
        />
        <AvatarFallback>{displayName ? displayName.charAt(0) : "U"}</AvatarFallback>
      </Avatar>
    </div>
  );
};

// Main profile dialog component
const ProfileForm = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const displayName = user.user_metadata?.full_name;
  const email = user.email;
  const { savePageAsync } = useSavePage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => savePageAsync()}>
          <ProfileAvatarTrigger user={user} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2">
              <AvatarImage
                src={user.user_metadata?.avatar_url || "https://avatar.iran.liara.run/public/boy"}
                alt={user.user_metadata?.full_name || ""}
              />
              <AvatarFallback>{displayName ? displayName.charAt(0) : "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{displayName || "User Profile"}</h2>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </DialogTitle>
          <DialogDescription>Manage your account settings and profile information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
            <div className="space-y-4">
              <ProfileName initialName={displayName || ""} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" value={email} readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
              </div>
              <ChangePasswordModal />
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="pt-4 border-t border-gray-200">
            <LogoutButton fullWidth={true} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileForm;
export { ProfileAvatarTrigger };
