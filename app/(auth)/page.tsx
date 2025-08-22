import LoginButton from "@/components/auth/login-button";
import LoginForm from "@/components/auth/login-form";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Welcome back
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Sign in to continue to your dashboard
      </p>
      <LoginForm />

      <div className="my-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="my-6 text-center text-xs text-gray-500"> OR</div>

      <LoginButton />
    </>
  );
}
