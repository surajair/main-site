"use client";

import { supabase } from "@/chai/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=reset`,
      });
      setIsSubmitted(true);
      toast.success("Password reset link sent! Please check your email.", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset link", {
        position: "top-right",
      });
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
        <p className="text-muted-foreground text-sm">
          Please check your email and follow the instructions to reset your password.
        </p>
        <br />
        <Link
          href="/login"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-20 py-3 rounded">
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
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </>
  );
}
