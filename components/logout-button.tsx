"use client";

import { supabase } from "@/chai/supabase";
import { Button } from "@/components/ui/button";
import { useTranslation } from "chai-next";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  fullWidth?: boolean;
}

export default function LogoutButton({
  variant = "outline",
  size = "sm",
  showText = true,
  fullWidth = false,
}: LogoutButtonProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("__logged_in_user");
      router.push("/login");
    } catch (error) {
      toast.error(t("Failed to sign out"));
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const finalClassName = `flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600 ${fullWidth ? "w-full" : ""}`;

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={isLoading} className={finalClassName}>
      {isLoading ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          {showText && t("Signing out")}
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          {showText && t("Sign Out")}
        </>
      )}
    </Button>
  );
}
