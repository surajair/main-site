import { getDomainsCount } from "@/lib/getter/sites";
import { usePlanLimits } from "@/lib/openfeature/helper";
import { useQuery } from "@tanstack/react-query";
import { map } from "lodash";
import { useWebsites } from "./use-websites";

export const useCanAddDomain = () => {
  const { data: websites } = useWebsites();
  const planLimits = usePlanLimits();
  const customDomainLimit = planLimits.getLimit("no_of_custom_domains");
  const { data, isLoading } = useQuery({
    staleTime: Infinity,
    gcTime: 0,
    queryKey: ["DOMAINS_COUNT"],
    queryFn: () => getDomainsCount(map(websites, "id")),
    enabled: !!websites?.length,
    placeholderData: 0,
  });

  if (isLoading) return { canAdd: false, customDomainLimit };
  const isCustomDomainLimitReached = planLimits.hasReached("no_of_custom_domains", data || 0);
  return { isCustomDomainLimitReached, customDomainLimit };
};
