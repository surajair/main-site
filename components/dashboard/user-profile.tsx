"use client";

import { supabase } from "@/chai/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Loader from "./loader";

export function UserProfile({ user }: { user: User }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: {session}, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to fetch user data:", error);
      } else {
        const user = {
          accessToken: session?.access_token,
          email: session?.user?.email,
          expiresAt: session?.expires_at,
          id: session?.user?.id,
          name: session?.user?.user_metadata?.name || session?.user?.email,
          refreshToken: session?.refresh_token
        };
        localStorage.setItem("__logged_in_user", JSON.stringify(user));
      }
    };

    fetchUserData();
  }, []);
  const handleSignOut = async (e: any) => {
    e.preventDefault();

    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full p-0 h-max pl-2 border border-transparent hover:border-border">
          <span className="ml-1 leading-tight hidden sm:block">
            {user.user_metadata.name || user.email}
          </span>
          <Avatar className="h-7 w-7 border-2 text-xs bg-muted">
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name || ""}
            />
            <AvatarFallback>
              {user?.user_metadata?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.user_metadata.full_name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/update-password")}
          disabled={isSigningOut}>
          Change Password
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent text-destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}>
          {isSigningOut ? (
            <>
              <Loader fullscreen={false} />
              Signing out...
            </>
          ) : (
            "Sign out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
