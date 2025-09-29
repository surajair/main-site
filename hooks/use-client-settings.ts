import { getClientSettings } from "@/lib/getter";
import { useQuery } from "@tanstack/react-query";

export const useClientSettings = () => {
  return useQuery({
    staleTime: Infinity,
    gcTime: Infinity,
    queryKey: ["client-settings"],
    queryFn: getClientSettings,
  });
};
