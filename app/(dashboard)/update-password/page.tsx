import UpdatePassword from "@/components/auth/update-password";
import { Logo } from "@/components/logo";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

type PasswordType = "set" | "reset" | "change";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type = "set" } = await searchParams;
  const title = {
    set: "Set your password",
    reset: "Reset your password",
    change: "Change your password",
  }[type];

  const description = {
    set: "Set a password for your account to enhance security",
    reset: "Enter your new password below",
    change: "Enter your new password below",
  }[type];

  return (
    <div className="flex flex-col">
      <div className="container flex h-16 items-center justify-between"></div>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-lg min-w-96  rounded-lg p-8">
          <Link
            href="/sites"
            className="text-sm text-fuchsia-500 hover:text-fuchsia-700 flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to sites
          </Link>
          <div className="py-8">
            <div className="flex justify-center mb-8">
              <Logo width={50} height={50} shouldRedirect={false} />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>

            <p className="mt-2 text-center text-sm text-gray-600">
              {description}
            </p>
          </div>
          <UpdatePassword type={type as PasswordType} />
        </div>
      </div>
    </div>
  );
}
