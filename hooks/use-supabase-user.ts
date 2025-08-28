import { supabase } from "@/chai/supabase";
import { useEffect, useState } from "react";

export const useSupabaseUser = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    setReady(true);
    const fetchUserData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to fetch user data:", error);
      } else {
        const user = {
          accessToken: session?.access_token,
          email: session?.user?.email,
          expiresAt: session?.expires_at,
          id: session?.user?.id,
          name: session?.user?.user_metadata?.name || session?.user?.email,
          refreshToken: session?.refresh_token,
        };
        localStorage.setItem("__logged_in_user", JSON.stringify(user));
      }
      setReady(true);
    };

    fetchUserData();
  }, []);

  return { ready };
};
