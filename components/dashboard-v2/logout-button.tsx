"use client";

import { logout } from "@/actions/user-auth-action";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: any) => {
    e?.stopPropagation();
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenuItem
      className="text-red-600 cursor-pointer hover:bg-red-100"
      onClick={handleLogout}
      disabled={isLoggingOut}>
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </DropdownMenuItem>
  );
}
