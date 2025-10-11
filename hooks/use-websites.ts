import { getSites } from "@/lib/getter";
import { useQuery } from "@tanstack/react-query";

export const useWebsites = () => {
  return useQuery({
    staleTime: Infinity,
    gcTime: Infinity,
    queryKey: ["websites-list"],
    queryFn: getSites,
  });
};
