"use client";

import UpdatePassword from "@/components/auth/update-password";

export default function ResetPassword() {
  return (
    <div className="space-y-8 pb-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Reset Password</h2>
        <p className="text-muted-foreground">Enter your new password below to reset your account</p>
      </div>

      <UpdatePassword />
    </div>
  );
}
