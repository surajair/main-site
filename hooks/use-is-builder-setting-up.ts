import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useIsBuilderSettingUp = (checkNow: boolean) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
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
      setProgress(
        [
          isFetchingCollections ? 10 : 0,
          isFetchingPageTypes ? 10 : 0,
          isFetchingCollections ? 10 : 0,
          isFetchingDraftSetting ? 10 : 0,
        ].reduce((a, b) => a + b, 0),
      );
    }, 500);
    return () => {
      clearInterval(interval);
      setLoading(false);
    };
  }, [checkNow, queryClient]);

  return { setupProgress: progress, isBuilderReady: !loading };
};
