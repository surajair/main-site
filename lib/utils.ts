import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BrandConfig {
  logo?: string;
  name?: string;
  favicon?: string;
}

const DEFAULT_BRAND_CONFIG: BrandConfig = {
  name: "Your Brand",
  logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjI1IiBoZWlnaHQ9IjYyNSIgdmlld0JveD0iMCAwIDYyNSA2MjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYyNSIgaGVpZ2h0PSI2MjUiIHJ4PSIxMDAiIGZpbGw9IiNjNDYzNDIiLz48Y2lyY2xlIGN4PSIzMTIuNSIgY3k9IjMxMi41IiByPSIxNTAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=",
  favicon:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjI1IiBoZWlnaHQ9IjYyNSIgdmlld0JveD0iMCAwIDYyNSA2MjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYyNSIgaGVpZ2h0PSI2MjUiIHJ4PSIxMDAiIGZpbGw9IiNjNDYzNDIiLz48Y2lyY2xlIGN4PSIzMTIuNSIgY3k9IjMxMi41IiByPSIxNTAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=",
};

export function getBrandConfig(): BrandConfig {
  try {
    const config = process.env.NEXT_PUBLIC_BRAND_CONFIG;
    if (!config) {
      return DEFAULT_BRAND_CONFIG;
    }

    const configJson = JSON.parse(config);
    return { ...DEFAULT_BRAND_CONFIG, ...configJson };
  } catch (error) {
    console.warn("Failed to parse brand config:", error);
    return DEFAULT_BRAND_CONFIG;
  }
}
