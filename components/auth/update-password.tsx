"use client";

import { updatePasswordAction } from "@/actions/user-auth-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary/80 hover:bg-primary" disabled={pending}>
      {pending ? (
        <>
          <Loader className="h-4 w-4 animate-spin" /> Updating
        </>
      ) : (
        "Update Password"
      )}
    </Button>
  );
}

export default function UpdatePassword({ close }: { close?: () => void }) {
  const [state, formAction] = useFormState(updatePasswordAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message, { position: "top-right" });
        close?.();
      } else {
        toast.error(state.message, { position: "top-right" });
      }
    }
  }, [state, close]);

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              required
              className="border-gray-300"
              placeholder="New Password"
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
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="border-gray-300"
              placeholder="Confirm New Password"
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
