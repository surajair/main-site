"use client";

import { loginWithEmail } from "@/actions/user-auth-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "chai-next";
import { EyeClosed, EyeIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginWithEmail(email, password);

      if (result.success) {
        toast.success(result.message, { position: "top-right" });
        router.push("/");
      } else {
        toast.error(result.message, {
          position: "top-right",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(t("An unexpected error occurred. Please try again."), {
        position: "top-right",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("Email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("name@example.com")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("Password")}</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              {t("Forgot password?")}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("Password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 hover:bg-transparent hover:text-muted-foreground"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}>
              {!showPassword ? <EyeIcon /> : <EyeClosed />}
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              {t("Signing in")}
            </>
          ) : (
            t("Sign in")
          )}
        </Button>
      </form>
    </>
  );
}
