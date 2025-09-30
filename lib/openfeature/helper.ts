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
import { OpenFeature, useFlag } from "@openfeature/react-sdk";
import { useCallback } from "react";

export interface PlanLimits {
  id: string;
  name: string;
  isFree?: boolean;
  limits: Record<string, any>;
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
  const { value } = useFlag("user_plan", {
    id: "",
    limits: {},
    name: "FREE",
    isFree: true,
  });

  return value;
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
  const value = useUserPlan();
  const limits = get(value, "limits", {}) || {};

  return {
    getLimit: (resource: keyof typeof limits | string) => get(limits, resource, 0),
    hasReached: (resource: keyof typeof limits | string, current: number) => {
      const limit = get(limits, resource, 0);
      return typeof limit === "number" ? current >= limit : false;
    },
  };
};

export const useShowUpgradeDialog = () => {
  return useCallback(() => {
    const openfeatureContext = OpenFeature.getContext();
    const showUpgrade = openfeatureContext?.showUpgrade as any;
    if (typeof showUpgrade === "function") showUpgrade();
  }, []);
};
