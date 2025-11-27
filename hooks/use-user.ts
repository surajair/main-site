import { getSession } from "@/lib/getter";
import { Session, User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

// * Save user in local storage
const saveUserInLocalStorage = (session: Session | null) => {
  if (!session || !session.user) return;
  const user = {
    accessToken: session?.access_token,
    email: session?.user?.email,
    expiresAt: session?.expires_at,
    id: session?.user?.id,
    name: session?.user?.user_metadata?.name || session?.user?.email,
    refreshToken: session?.refresh_token,
  };
  localStorage.setItem("__logged_in_user", JSON.stringify(user));
};

type TUser = {
  user: User | null;
  session: Session | null;
  role: string;
  isLoggedIn: boolean;
};

export const useUser = () => {
  return useQuery<TUser>({
    queryKey: ["CHAIBUILDER_USER"],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      try {
        const session = await getSession();
        saveUserInLocalStorage(session);
        const user = session?.user;

        return { user, session, role: "admin", isLoggedIn: true };
      } catch (error) {
        return { user: null, session: null, plan: null, role: "admin", isLoggedIn: false };
      }
    },
    placeholderData: {
      user: null,
      session: null,
      role: "admin",
      isLoggedIn: false,
    },
  });
};
