import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFeatureFlag } from "@/lib/openfeature/server";
import { User as UserType } from "@supabase/supabase-js";
import { ChevronDown, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { BrandLogo, BrandName } from "../branding";

async function TopNavigation({ user }: { user: UserType }) {
  const plan = user.user_metadata?.plan || "Free Plan";
  const role = user.user_metadata?.role || "Admin";
  const showBillingInfo = await getFeatureFlag("billing", false);

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full container">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-x-2">
            <BrandLogo shouldRedirect={false} />
            <BrandName />
          </Link>
        </div>

        {/* Right side - User info and notifications */}
        <div className="flex items-center space-x-4">
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-11 hover:bg-primary/5">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url || "https://avatar.iran.liara.run/public/boy"}
                    alt={user.user_metadata?.full_name || ""}
                  />
                  <AvatarFallback className="border border-border">
                    {user.user_metadata?.full_name || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name || user.user_metadata?.email}
                  </span>
                  <span className="text-xs flex items-center gap-x-1 text-primary">
                    <span>{role}</span> <span>-</span>
                    <span>{plan}</span>
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom" className="w-56">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100">
                <Link href="/account/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {showBillingInfo && (
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100">
                  <Link href="/account/billing-and-plans" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing & Plans
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {/* <LogoutButton /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;
