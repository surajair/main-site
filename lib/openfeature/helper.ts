import { find, get } from "lodash";

interface UserPermissions {
  permissions: {
    [key: string]: boolean;
  };
}

// * Transforming into Open Feature Dev Format
export function convertToOpenFeatureDevFormat(input: Record<string, any>, role: string, plan: string) {
  const features = input?.features || {};
  let planData = find(input?.plans, { id: plan });
  if (!planData) planData = find(input?.plans, { isFree: true }) || {};
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

// Hook for user plan with typed limits
export const useUserPlan = () => {
  const value = {
    id: "",
    limits: {},
    name: "FREE",
    isFree: true,
    nextBilledAt: null as string | null,
    scheduledForCancellation: false,
  };

  return value;
};

// Hook for user role and permissions
export const useUserRole = () => {
  const value = {
    permissions: { "*": false },
  };

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
