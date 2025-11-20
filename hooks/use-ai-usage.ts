import { getAiUsage } from "@/lib/getter/ai";
import { usePlanLimits } from "@/lib/openfeature/helper";
import { useQuery } from "@tanstack/react-query";

export const useAiUsage = () => {
  // Fetch token usage data from server or database
  const { data: totalTokensUsed = 0, isLoading } = useQuery({
    staleTime: Infinity,
    gcTime: Infinity,
    queryKey: ["ai-usage"],
    queryFn: getAiUsage,
  });

  // Get total credits allowed in plan
  const planLimits = usePlanLimits();
  const totalCredit = planLimits?.getLimit("no_of_ai_credits") || 0;

  // Calculate used credits
  const usedCredit = totalTokensUsed / 2000;

  // Calculate remaining credits
  const remainingCredit = totalCredit - usedCredit > 0 ? totalCredit - usedCredit : 0;
  const isCreditLeft = remainingCredit > 0;

  return {
    isLoading,
    totalCredit: totalCredit,
    isCreditLeft: isCreditLeft,
    usedCredit: parseFloat(usedCredit.toFixed(2)),
    remainingCredit: parseFloat(remainingCredit.toFixed(2)),
  };
};
