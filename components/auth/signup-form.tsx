"use client";

import { signupWithEmail } from "@/actions/user-auth-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "chai-next";
import { EyeClosed, EyeIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error(t("Passwords do not match"), {
        position: "top-right",
      });
      return;
    }

    // Validate password length
    if (password.length < 8) {
      toast.error(t("Password must be at least 8 characters long"), {
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signupWithEmail(email, password);

      if (result.success) {
        toast.success(result.message, {
          position: "top-right",
        });
        router.push("/login");
      } else {
        toast.error(result.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(t("An unexpected error occurred. Please try again."), {
        position: "top-right",
      });
    } finally {
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
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("Password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("Password")}
              disabled={isLoading}
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
          <p className="text-xs text-muted-foreground">{t("Password must be at least 8 characters long")}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t("Confirm Password")}</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t("Confirm Password")}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 hover:bg-transparent hover:text-muted-foreground"
              onClick={(e) => {
                e.preventDefault();
                setShowConfirmPassword(!showConfirmPassword);
              }}>
              {!showConfirmPassword ? <EyeIcon /> : <EyeClosed />}
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              {t("Creating account")}
            </>
          ) : (
            t("Create account")
          )}
        </Button>
      </form>
    </>
  );
}
