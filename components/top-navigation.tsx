import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserType } from "@supabase/supabase-js";
import { ChevronDown, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./dashboard-v2/logout-button";

async function TopNavigation({ user }: { user: UserType }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-foreground tracking-wide flex items-center gap-x-2">
            <Logo shouldRedirect={false} />
            Your Brand
          </Link>
        </div>

        {/* Right side - User info and notifications */}
        <div className="flex items-center space-x-4">
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-10 hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || ""} />
                  <AvatarFallback className="border">
                    {user.user_metadata?.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.user_metadata?.full_name}</span>
                  <span className="text-xs text-primary">{user.user_metadata?.plan || "Free"} Plan</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
                  <p className="text-xs text-muted-foreground leading-none font-light">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
                <Link href="/account/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
                <Link href="/account/billing-and-plans" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing & Plans
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;
