"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileForm from "@/components/website-settings/profile-form";
import { getUser } from "@/lib/getter";
import { getPlan } from "@/lib/getter/users";
import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";
import { User as UserIcon } from "lucide-react";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await getUser();
      const userPlan = await getPlan();
      const plan = get(userPlan, "planId", "FREE");
      return { user, isFreePlan: plan === "FREE", plan: userPlan };
    },
  });
};

const LoadingAvatar = () => {
  return (
    <div className="flex items-center justify-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
      <Avatar className="h-8 w-8 border-2 border-border">
        <AvatarFallback>
          <UserIcon className="h-4 w-4 text-muted" />
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
