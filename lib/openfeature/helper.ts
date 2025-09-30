import { find, get } from "lodash";

/**
 *
 * @param input
 * @param role
 * @param plan
 * @returns flags
 */
export function convertToOpenFeatureDevFormat(input: Record<string, any>, role: string, plan: string) {
  const features = input?.features || {};
  const planData = find(input?.plans, { id: plan }) || {};
  const roleData = get(input?.roles, role, {}) || {};

  const flags: Record<string, any> = {
    user_plan: {
      variants: {
        [plan]: planData,
      },
      defaultVariant: plan,
    },
    user_role: {
      variants: {
        [role]: roleData,
      },
      defaultVariant: role,
    },
  };

  Object.keys(features).forEach((key) => {
    flags[key] = {
      disabled: false,
      variants: {
        default: features[key],
      },
      defaultVariant: "default",
    };
  });

  return flags;
}

// hooks/useFeatureFlags.ts
import { useFlag } from "@openfeature/react-sdk";

export interface PlanLimits {
  id: string;
  name: string;
  limits: {
    no_of_sites: number;
    no_of_pages: number;
    no_of_page_views: number;
    no_of_custom_domains: number;
    no_of_additional_languages: number;
    no_of_form_sudmissions: number;
    no_of_ai_edits: number;
    assets: string;
    no_of_revisions: number;
  };
}

export interface UserPermissions {
  permissions: {
    [key: string]: boolean;
  };
}

// Hook for boolean feature flags
export const useFeatureFlag = (flagKey: string, defaultValue = false) => {
  return useFlag(flagKey, defaultValue);
};

// Hook for user plan with typed limits
export const useUserPlan = () => {
  return useFlag("user_plan", {
    id: "",
    name: "",
    limits: {},
  });
};

// Hook for user role and permissions
export const useUserRole = () => {
  const { value } = useFlag("user_role", {
    permissions: { "*": false },
  });

  const permissions = (value as UserPermissions).permissions;

  return {
    permissions,
    hasFullAccess: permissions["*"] === true,
    canAccess: (resource: string) => permissions[resource] ?? permissions["*"] ?? false,
  };
};

// Convenience hook for checking plan limits
export const usePlanLimits = () => {
  const { value } = useUserPlan();
  const limits = get(value, "limits", {}) || {};

  return {
    getLimit: (resource: keyof typeof limits | string) => get(limits, resource, 0),
    hasReached: (resource: keyof typeof limits | string, current: number) => {
      const limit = get(limits, resource, 0);
      return typeof limit === "number" ? current >= limit : false;
    },
  };
};
