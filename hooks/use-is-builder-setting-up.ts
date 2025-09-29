import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useIsBuilderSettingUp = (checkNow: boolean) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checkNow) return;
    let interval = setInterval(() => {
      const isFetchingPermission = queryClient.isFetching({ queryKey: ["GET_ROLE_AND_PERMISSIONS"] });
      const isFetchingPageTypes = queryClient.isFetching({ queryKey: ["GET_PAGE_TYPES"] });
      const isFetchingCollections = queryClient.isFetching({ queryKey: ["GET_COLLECTIONS"] });
      const isFetchingDraftSetting = queryClient.isFetching({ queryKey: ["GET_WEBSITE_DRAFT_SETTINGS"] });
      const isLoading = isFetchingPermission || isFetchingPageTypes || isFetchingCollections || isFetchingDraftSetting;
      if (!isLoading) clearInterval(interval);
      setLoading(Boolean(isLoading));
    }, 500);
    return () => {
      clearInterval(interval);
      setLoading(false);
    };
  }, [checkNow, queryClient]);

  return loading;
};
