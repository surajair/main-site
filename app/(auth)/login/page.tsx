import LoginButton from "@/components/auth/login-button";
import LoginForm from "@/components/auth/login-form";
import { getClientSettings } from "@/lib/getter";
import Link from "next/link";

export default async function LoginPage() {
  const clientSettings = await getClientSettings();
  const isGoogleLoginEnabled = clientSettings.loginProviders?.includes("google");
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-foreground mb-2">Welcome back</h2>
      <p className="text-center text-muted-foreground mb-8">Sign in to continue to your dashboard</p>
      <LoginForm />

      <div className="my-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>

      {isGoogleLoginEnabled && (
        <>
          <div className="my-6 text-center text-xs text-muted-foreground"> OR</div>
          <LoginButton />
        </>
      )}
    </>
  );
}
