import ForgetPassword from "@/components/auth/forgot-password";
import Link from "next/link";

export default function ForgetPasswordPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">
        Reset password
      </h2>
      <p className="text-center text-muted-foreground mb-8">
        {
          "Enter your email address and we'll send you a link to reset your password"
        }
      </p>
      <ForgetPassword />

      <div className="my-6 text-center">
        <p className="text-sm text-muted-foreground">
          Got the password?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Back to login
          </Link>
        </p>
      </div>
    </>
  );
}
