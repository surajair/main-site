"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { resetPassword } from "@/actions/user-auth-action";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email, window.location.origin);
      setIsSubmitted(true);
      toast.success("Password reset link sent! Please check your email.", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset link",
        {
          position: "top-right",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold">Password Reset Link Sent</h3>
        <p className="text-gray-400 text-sm">
          Please check your email and follow the instructions to reset your
          password.
        </p>
        <br />
        <Link
          href="/login"
          className="w-full bg-fuchsia-800 hover:bg-fuchsia-700 text-white font-medium px-20 py-3 rounded"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-300"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-fuchsia-800 hover:bg-fuchsia-700"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </>
  );
}
