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
import { useUserPlan } from "@/lib/openfeature/helper";
import { useQueryClient } from "@tanstack/react-query";
import { useSavePage } from "chai-next";
import { get } from "lodash";
import { Crown, Loader, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UpgradeModalButton from "../upgrade/upgrade-modal-button";

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
      const result = await updateUserProfile(fullName.trim());

      if (result.success) {
        toast.success(result.message);
        setHasChanges(false);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
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
          autoFocus={false}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating || fullName === initialName} className="px-6">
          {isUpdating ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Updating
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
const ProfileAvatarTrigger = ({ data }: { data: any }) => {
  const user = get(data, "user");
  const displayName = user.user_metadata?.full_name || "";
  const plan = useUserPlan();
  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="flex items-center justify-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className={`mb-1.5 h-9 w-9 border-2 ${plan?.isFree ? "border-border" : "border-amber-600"}`}>
          <AvatarImage
            src={user.user_metadata?.avatar_url || "https://avatar.iran.liara.run/public/boy"}
            alt={displayName || ""}
          />
          <AvatarFallback className="bg-primary/30 text-primary font-bold">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        {!plan?.isFree && (
          <span className="absolute w-max -bottom-px text-center right-1/2 translate-x-1/2 z-50 bg-amber-100 font-bold text-amber-600 border border-amber-600 rounded-full px-1 py-px leading-none">
            <Crown className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};

// Main profile dialog component
const ProfileForm = ({ data }: { data: any }) => {
  const user = get(data, "user");
  const plan = useUserPlan();
  const planName = plan?.name;
  const [open, setOpen] = useState(false);
  const displayName = user.user_metadata?.full_name;
  const email = user.email;
  const { savePageAsync } = useSavePage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => savePageAsync()}>
          <ProfileAvatarTrigger data={data} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className={`h-12 w-12 border-2 ${plan?.isFree ? "border-border" : "border-amber-600"}`}>
                <AvatarImage
                  src={user.user_metadata?.avatar_url || "https://avatar.iran.liara.run/public/boy"}
                  alt={user.user_metadata?.full_name || ""}
                />
                <AvatarFallback className="bg-primary/30 text-primary font-bold">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              {!plan?.isFree && (
                <span className="absolute w-max -bottom-1 text-center right-1/2 translate-x-1/2 z-50 bg-amber-100 font-bold text-amber-600 border border-amber-600 rounded-full px-1 py-px leading-none">
                  <Crown className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold leading-none">{displayName || "User Profile"}</h2>
              <p className="text-sm text-muted-foreground font-normal">{email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {plan?.isFree ? (
          <div className="border rounded-md p-3 bg-muted">
            <p className="text-sm text-gray-600 pb-2">You are currently on Free plan</p>
            <UpgradeModalButton />
          </div>
        ) : (
          planName && (
            <div className="border rounded-md p-3 bg-muted">
              <p className="text-sm text-gray-600">
                You current plan: <span className="font-semibold text-amber-600">{planName}</span>
              </p>
            </div>
          )
        )}

        <div className="space-y-6 py-4 overflow-y-auto">
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
        </div>
        {/* Sign Out Section */}
        <div className="pt-4 border-t flex justify-end border-gray-200">
          <LogoutButton />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileForm;
