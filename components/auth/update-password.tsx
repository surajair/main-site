"use client";

import { updatePassword } from "@/actions/user-auth-action";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeClosed, EyeIcon, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UpdatePassword({ close }: { close?: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

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
      toast.success("Password updated successfully!", { position: "top-right" });
      close?.();
    } catch (error) {
      setError(error instanceof Error && error.message ? error.message : "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword, confirmPassword]);

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
        <Button type="submit" className="w-full bg-primary/80 hover:bg-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" /> Updating
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </>
  );
}
