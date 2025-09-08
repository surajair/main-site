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

export function getBrandConfig(): BrandConfig {
  try {
    const config = process.env.NEXT_PUBLIC_BRAND_CONFIG;
    if (!config) {
      return {};
    }
    
    const configJson = JSON.parse(config);
    return {
      logo: configJson?.brandLogo || configJson?.logo,
      name: configJson?.brandName || configJson?.name,
      favicon: configJson?.brandFavicon || configJson?.favicon,
    };
  } catch (error) {
    console.warn("Failed to parse brand config:", error);
    return {};
  }
}
