import { OpenFeature } from "@openfeature/server-sdk";
const client = OpenFeature.getClient();

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
