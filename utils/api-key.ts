import { createHmac, randomBytes } from "crypto";

export const encodedApiKey = (appId: string, secretKey: string): string => {
  // Generate a random component (16 bytes = 32 hex characters)
  const randomizer = randomBytes(3).toString("hex");
  const timestamp = Date.now().toString(36);
  const data = `${randomizer}#${appId}#${timestamp}`;
  const signature = createHmac("sha256", secretKey)
    .update(data)
    .digest("base64url");
  const apiKey = Buffer.from(`${data}:${signature}`).toString("base64");
  return apiKey;
};

export const decodedApiKey = (
  apiKey: string,
  secretKey: string
): {
  isValid: boolean;
  data?: { appId: string; timestamp: number };
} => {
  try {
    // Decode the base64 string
    const decoded = Buffer.from(apiKey, "base64").toString("utf-8");
    const [data, signature] = decoded.split(":");
    if (!data || !signature) return { isValid: false };

    // Verify the signature
    const expectedSignature = createHmac("sha256", secretKey)
      .update(data)
      .digest("base64url");
    if (signature !== expectedSignature) return { isValid: false };

    // Parse the data - now randomComponent is first
    const [, appId, timestamp] = data.split("#");
    if (!appId || !timestamp) return { isValid: false };

    return {
      isValid: true,
      data: {
        appId,
        timestamp: parseInt(timestamp, 36),
      },
    };
  } catch (error) {
    return { isValid: false };
  }
};
