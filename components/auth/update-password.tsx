"use client";

import { updatePassword } from "@/actions/user-auth-action";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, EyeClosed, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UpdatePasswordProps {
  type?: "set" | "reset" | "change";
  redirectTo?: string;
}

export default function UpdatePassword({ type = "change", redirectTo = "/" }: UpdatePasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const buttonText = {
    set: "Set Password",
    reset: "Reset Password",
    change: "Change Password",
  }[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      setIsSubmitted(true);
      toast.success("Password updated successfully!", {
        position: "top-center",
      });
      router.push(redirectTo);
    } catch (error) {
      setError(
        error instanceof Error && error.message ? "Please enter new valid password " : "Failed to update password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword, confirmPassword]);

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-normal font-semibold text-green-500 flex items-center gap-2 justify-center">
          <Check className="w-4 h-4" /> Password Updated
        </h2>
        <p className="text-muted-foreground">Your password has been successfully updated.</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="text-red-500 text-center mb-4 py-2">
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              {!showPassword ? <EyeIcon /> : <EyeClosed />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {!showConfirmPassword ? <EyeIcon /> : <EyeClosed />}
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full bg-fuchsia-800 hover:bg-fuchsia-700" disabled={isLoading}>
          {isLoading ? "Updating..." : buttonText}
        </Button>
      </form>
    </>
  );
}
