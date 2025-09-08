"use client";
import { supabase } from "@/chai/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfileForm from "@/components/website-settings/profile-form";
import { User } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
export const profilePanelId = "user-info";

const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

const LoadingAvatar = () => {
  return (
    <div className="flex items-center justify-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
      <Avatar className="h-9 w-9 border-2 border-border">
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export const ProfilePanel = () => {
  const { user, loading } = useUserData();

  if (loading) {
    return <LoadingAvatar />;
  }

  return <ProfileForm user={user} />;
};

export const ProfileButton = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  const { user, loading } = useUserData();

  if (loading) {
    return <LoadingAvatar />;
  }

  if (!user) {
    return null;
  }

  return <ProfileForm user={user} />;
};

// Profile Panel Configuration
export const profilePanel = {
  id: profilePanelId,
  label: "Profile",
  panel: ProfilePanel,
  button: ProfileButton,
  position: "bottom" as const,
  width: 600,
  view: "standard" as const,
};
