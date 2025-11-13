"use client";

import { cancelUserSubscription } from "@/actions/cancel-user-subscription";
import { resumeUserSubscription } from "@/actions/resume-user-subscription";
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
import { useSavePage, useTranslation } from "chai-next";
import { get } from "lodash";
import { AlertTriangle, Crown, Loader, RefreshCw, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UpgradeModalButton from "../upgrade/upgrade-modal-button";

function ProfileName({ initialName }: { initialName: string }) {
  const { t } = useTranslation();
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
      toast.error(t("An unexpected error occurred. Please try again."));
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("Name")}</label>
        <Input
          type="text"
          value={fullName}
          onChange={handleNameChange}
          placeholder={t("Enter your full name")}
          className="w-full"
          autoFocus={false}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating || fullName === initialName} className="px-6">
          {isUpdating ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              {t("Updating")}
            </>
          ) : (
            t("Update Name")
          )}
        </Button>
      </div>
    </form>
  );
}

// Change Password Modal Component
const ChangePasswordModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-primary/80 text-white rounded-md hover:bg-primary transition-colors">
          {t("Change Password")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("Change Password")}</DialogTitle>
          <DialogDescription>
            {t("Enter your new password below. Make sure it's at least 8 characters long.")}
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

// Cancel Subscription Modal Component
const CancelSubscriptionModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { t } = useTranslation();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelUserSubscription();

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result.message || t("Failed to cancel subscription. Please try again."));
      }
    } catch (error) {
      toast.error(t("Failed to cancel subscription. Please try again."));
      console.error("Subscription cancellation error:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {t("Cancel Subscription")}
          </DialogTitle>
          <DialogDescription className="text-left">
            {t(
              "Are you sure you want to cancel your subscription? This action will take effect at the end of your current billing period.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">{t("What happens when you cancel?")}</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• {t("You'll continue to have access until the end of your billing period")}</li>
              <li>• {t("No further charges will be made to your account")}</li>
              <li>• {t("You can resubscribe at any time")}</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCancelling}>
            {t("Keep Subscription")}
          </Button>
          <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCancelling}>
            {isCancelling ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                {t("Cancelling...")}
              </>
            ) : (
              t("Cancel Subscription")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Resume Subscription Modal Component
const ResumeSubscriptionModal = ({
  open,
  onOpenChange,
  nextBilledAt,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextBilledAt: string;
}) => {
  const { t } = useTranslation();
  const [isResuming, setIsResuming] = useState(false);
  const queryClient = useQueryClient();

  const handleResumeSubscription = async () => {
    setIsResuming(true);
    try {
      const result = await resumeUserSubscription();

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["user"] });
        onOpenChange(false);
      } else {
        toast.error(result.message || t("Failed to resume subscription. Please try again."));
      }
    } catch (error) {
      toast.error(t("Failed to resume subscription. Please try again."));
      console.error("Subscription resume error:", error);
    } finally {
      setIsResuming(false);
    }
  };

  // Format the cancellation date
  const cancellationDate = new Date(nextBilledAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <RefreshCw className="h-5 w-5" />
            {t("Resume Subscription")}
          </DialogTitle>
          <DialogDescription className="text-left">
            {t("Your subscription is scheduled to be cancelled. Would you like to resume it?")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">{t("Cancellation Scheduled")}</h4>
            <p className="text-sm text-amber-800">
              {t("Your plan will be cancelled on")} <span className="font-semibold">{cancellationDate}</span>
            </p>
            <p className="text-sm text-amber-800 mt-1">
              {t("Resuming will keep your subscription active and you'll continue to be billed.")}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isResuming}>
            {t("Keep Cancelled")}
          </Button>
          <Button onClick={handleResumeSubscription} disabled={isResuming}>
            {isResuming ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                {t("Resuming...")}
              </>
            ) : (
              t("Resume Subscription")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main profile dialog component
const ProfileForm = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  const user = get(data, "user");
  const plan = useUserPlan();

  const planName = plan?.name;
  const nextBilledAt = plan?.nextBilledAt;
  const scheduledForCancellation = plan?.scheduledForCancellation;
  const [open, setOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
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
              <h2 className="text-xl font-semibold leading-none">{displayName || t("User Profile")}</h2>
              <p className="text-sm text-muted-foreground font-normal">{email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {plan?.isFree ? (
          <div className="border rounded-md p-3 bg-muted">
            <p className="text-sm text-gray-600 pb-2">{t("You are currently on Free plan")}</p>
            <UpgradeModalButton />
          </div>
        ) : (
          planName && (
            <>
              <div className="border rounded-md p-3 bg-muted">
                <p className="text-sm text-gray-600">
                  {t("You current plan:")} <span className="font-semibold text-amber-600">{planName}</span>
                </p>
                {scheduledForCancellation && nextBilledAt && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-xs text-amber-800">
                      {t("Scheduled for cancellation on")}{" "}
                      {new Date(nextBilledAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  {scheduledForCancellation ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setResumeModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {t("Resume Plan")}
                    </Button>
                  ) : (
                    <Button variant="link" size="sm" onClick={() => setCancelModalOpen(true)}>
                      {t("Cancel plan")}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )
        )}

        <div className="space-y-6 py-4 overflow-y-auto">
          {/* Account Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("Account Details")}</h3>
            <div className="space-y-4">
              <ProfileName initialName={displayName || ""} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("Email")}</label>
                <Input type="email" value={email} readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900">{t("Password")}</h4>
                <p className="text-sm text-gray-600">{t("Update your password to keep your account secure")}</p>
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

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal open={cancelModalOpen} onOpenChange={setCancelModalOpen} />

      {/* Resume Subscription Modal */}
      {nextBilledAt && (
        <ResumeSubscriptionModal open={resumeModalOpen} onOpenChange={setResumeModalOpen} nextBilledAt={nextBilledAt} />
      )}
    </Dialog>
  );
};

export default ProfileForm;
