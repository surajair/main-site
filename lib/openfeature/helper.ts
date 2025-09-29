import { get, groupBy, isObject } from "lodash";

type Role = "admin" | "editor" | "designer";

export function transformFeatureFlags(_featureJson: Record<string, any>, role: Role, plan: string): any {
  try {
    let featureJson: Record<string, any> = isObject(_featureJson) ? _featureJson : {};

    // * Merging feature flags based on plan and role
    const features = featureJson?.features || {};
    const planFeatures = get(groupBy(featureJson?.plans, "id"), [plan, 0, "plans"]) || {};
    let allFeatures = { ...features, ...planFeatures };

    const roleFeatures = featureJson?.roles?.[role] || {};
    if (roleFeatures?.["*"]) {
      allFeatures = Object.keys(allFeatures).reduce((acc, key) => {
        if (typeof allFeatures[key] === "boolean") {
          acc[key] = true;
        } else {
          acc[key] = allFeatures[key];
        }
        return acc;
      }, {} as any);
    } else {
      allFeatures = { ...allFeatures, ...roleFeatures };
    }

    const flags: any = {};
    Object.keys(allFeatures).forEach((key) => {
      flags[key] = {
        disabled: false,
        variants: {
          default: allFeatures[key],
        },
        defaultVariant: "default",
      };
    });

    return flags;
  } catch (error) {
    return {} as any;
  }
}
