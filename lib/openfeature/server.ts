import { OpenFeature } from "@openfeature/server-sdk";
import { readFileSync } from "fs";
import { join } from "path";

const client = OpenFeature.getClient();

type Role = "admin" | "editor" | "designer";
type Plan = "free" | "pro";

export async function fetchFeatureFlags(role: Role, plan: Plan): Promise<any> {
  try {
    // * Fetching feature flags from public/features.json
    const flagsPath = join(process.cwd(), "public", "features.json");
    const flagsContent = readFileSync(flagsPath, "utf8");
    const featureJson = JSON.parse(flagsContent) || {};

    // * Merging feature flags based on plan and role
    const features = featureJson?.features || {};
    const freeFeature = featureJson?.plans?.free || {};
    let allFeatures = { ...features, ...freeFeature };

    if (plan === "pro") {
      const proFeature = featureJson?.plans?.pro || {};
      allFeatures = { ...allFeatures, ...proFeature };
    }

    const roleFeature = featureJson?.roles?.[role] || {};
    if (roleFeature?.["*"]) {
      allFeatures = Object.keys(allFeatures).reduce((acc, key) => {
        if (typeof allFeatures[key] === "boolean") {
          acc[key] = true;
        } else {
          acc[key] = allFeatures[key];
        }
        return acc;
      }, {} as any);
    } else {
      allFeatures = { ...allFeatures, ...roleFeature };
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
    return {};
  }
}

// Function overloads for better type inference
export async function getFeatureFlag<T>(key: string, defaultValue: T): Promise<T | any> {
  if (typeof defaultValue === "boolean") {
    return await client.getBooleanValue(key, defaultValue);
  }

  if (typeof defaultValue === "string") {
    return await client.getStringValue(key, defaultValue);
  }

  if (typeof defaultValue === "number") {
    return await client.getNumberValue(key, defaultValue);
  }

  return await client.getObjectValue(key, defaultValue as any);
}
