"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileForm from "@/components/website-settings/profile-form";
import { getUser } from "@/lib/getter";
import { getPlan } from "@/lib/getter/users";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { AvatarImage } from "chai-next";
import { get } from "lodash";
import { User as UserIcon } from "lucide-react";

export const useUser = () => {
  return useQuery<{ user: User | null; isPaidPlan: boolean; plan: any }>({
    queryKey: ["chaibuilder-user"],
    queryFn: async () => {
      try {
        const user = await getUser();
        const userPlan = await getPlan(user.id);
        const plan = get(userPlan, "planId", "FREE");
        return { user, isPaidPlan: plan !== "FREE", plan: userPlan };
      } catch (error) {
        return { user: null, isPaidPlan: false, plan: null };
      }
    },
  });
};

const LoadingAvatar = () => {
  return (
    <div className="flex items-center justify-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
      <Avatar className={`mb-1.5h-9 w-9 border-2`}>
        <AvatarImage src={"https://avatar.iran.liara.run/public/boy"} alt={""} />
        <AvatarFallback className="bg-primary/30 text-primary font-bold">
          <UserIcon className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

const ProfilePanel = () => {
  const { data } = useUser();
  return <ProfileForm data={data} />;
};

const ProfileButton = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  const { data, isLoading } = useUser();

  if (isLoading) return <LoadingAvatar />;
  if (!get(data, "user")) return null;

  return <ProfileForm data={data} />;
};

// Profile Panel Configuration
export const profilePanel = {
  id: "user-info",
  label: "Profile",
  panel: ProfilePanel,
  button: ProfileButton,
  position: "bottom" as const,
  width: 600,
  view: "standard" as const,
};
