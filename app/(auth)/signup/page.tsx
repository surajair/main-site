import LoginButton from "@/components/auth/login-button";
import SignupForm from "@/components/auth/signup-form";
import Link from "next/link";

export default async function SignupPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Create Account
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Sign up to create your account
      </p>
      <SignupForm />

      <div className="my-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="my-6 text-center text-xs text-gray-500"> OR</div>

      <LoginButton />
    </>
  );
}
