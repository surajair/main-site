"use client";

import { updatePasswordAction } from "@/actions/user-auth-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "chai-next";
import { Eye, EyeOff, Loader } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { t } = useTranslation();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary/80 hover:bg-primary" disabled={pending}>
      {pending ? (
        <>
          <Loader className="h-4 w-4 animate-spin" /> {t("Updating")}
        </>
      ) : (
        t("Update Password")
      )}
    </Button>
  );
}

export default function UpdatePassword({ close }: { close?: () => void }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isResetPassword = pathname.includes("reset-password");
  const [state, formAction] = useFormState(updatePasswordAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(isResetPassword ? t("Password reset successfully!") : t("Password updated successfully!"), {
          position: "top-right",
        });
        if (isResetPassword) {
          router.push("/");
        } else {
          close?.();
        }
      } else {
        toast.error(state.message, {
          position: "top-right",
        });
      }
    }
  }, [state, close, isResetPassword, router, t]);

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">{t("New Password")}</Label>
          <div className="relative">
            <Input
              id="new-password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              required
              className="border-gray-300"
              placeholder={t("New Password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 hover:bg-transparent hover:text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}>
              {!showPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t("Confirm New Password")}</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="border-gray-300"
              placeholder={t("Confirm New Password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                setShowConfirmPassword(!showConfirmPassword);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 hover:bg-transparent hover:text-gray-500">
              {!showConfirmPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>
        </div>
        <SubmitButton />
      </form>
    </>
  );
}
