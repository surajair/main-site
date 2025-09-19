import { clsx, type ClassValue } from "clsx";
import {
  camelCase,
  forEach,
  get,
  includes,
  isEmpty,
  isNil,
  isObject,
  join,
  keys,
  map,
  replace,
  sortBy,
  startCase,
  toString,
} from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | undefined): string {
  if (!price) return "";
  return price.replace(/\.00$/, "");
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

// CSV utility functions
export function convertToCSV(data: any[]): string {
  if (isEmpty(data)) return "";

  // Get all unique keys from all objects using Lodash
  const allKeys = new Set<string>();

  forEach(data, (item) => {
    // Add direct properties
    forEach(keys(item), (key) => {
      if (!includes(["formData", "additionalData"], key)) {
        allKeys.add(key);
      }
    });

    // Add formData properties with prefix
    if (isObject(item.formData)) {
      forEach(keys(item.formData), (key) => allKeys.add(`formData.${key}`));
    }

    // Add additionalData properties with prefix
    if (isObject(item.additionalData)) {
      forEach(keys(item.additionalData), (key) => allKeys.add(`additionalData.${key}`));
    }
  });

  const headers = Array.from(allKeys);

  // Helper function to escape CSV values using Lodash
  const escapeCSV = (value: any): string => {
    if (isNil(value)) return "";
    const str = toString(value);
    if (includes(str, '"')) {
      return `"${replace(str, /"/g, '""')}"`;
    }
    if (includes(str, ",") || includes(str, "\n") || includes(str, "\r")) {
      return `"${str}"`;
    }
    return str;
  };

  // Create CSV rows using Lodash
  const csvRows = [join(headers, ",")];

  forEach(data, (item) => {
    const row = map(headers, (header) => {
      if (header.startsWith("formData.")) {
        const key = replace(header, "formData.", "");
        return escapeCSV(get(item, `formData.${key}`));
      }
      if (header.startsWith("additionalData.")) {
        const key = replace(header, "additionalData.", "");
        return escapeCSV(get(item, `additionalData.${key}`));
      }
      return escapeCSV(get(item, header));
    });
    csvRows.push(join(row, ","));
  });

  return join(csvRows, "\n");
}

// Humanize field names for better readability using Lodash
function humanizeFieldName(field: string): string {
  return startCase(camelCase(field));
}

// Convert form submissions to CSV with clean, human-readable format using Lodash
export function convertFormSubmissionsToCSV(data: any[]): string {
  if (isEmpty(data)) return "";

  // Define the columns we want in order
  const staticColumns = ["Form Name", "Page URL", "Date", "Time"];
  const formFieldColumns = new Set<string>();

  // First pass: collect all form fields for dynamic columns using Lodash
  forEach(data, (item) => {
    if (isObject(item.formData)) {
      forEach(keys(item.formData), (key) => {
        if (key !== "formName") {
          // Skip formName as it's already included
          formFieldColumns.add(humanizeFieldName(key));
        }
      });
    }
  });

  // Combine static columns with dynamic form field columns using Lodash
  const dynamicColumns = sortBy(Array.from(formFieldColumns));
  const allColumns = [...staticColumns, ...dynamicColumns];

  // Helper function to escape CSV values using Lodash
  const escapeCSV = (value: any): string => {
    if (isNil(value)) return "";
    const str = toString(value);
    if (includes(str, '"')) {
      return `"${replace(str, /"/g, '""')}"`;
    }
    if (includes(str, ",") || includes(str, "\n") || includes(str, "\r")) {
      return `"${str}"`;
    }
    return str;
  };

  // Create CSV rows using Lodash
  const csvRows = [join(allColumns, ",")];

  forEach(data, (item) => {
    const createdAt = new Date(get(item, "createdAt"));
    const date = createdAt.toLocaleDateString();
    const time = createdAt.toLocaleTimeString();

    const row = map(allColumns, (column) => {
      switch (column) {
        case "Form Name":
          return escapeCSV(get(item, "formData.formName", ""));
        case "Page URL":
          return escapeCSV(get(item, "additionalData.pageUrl", ""));
        case "Date":
          return escapeCSV(date);
        case "Time":
          return escapeCSV(time);
        default:
          // Handle dynamic form fields using Lodash
          if (isObject(item.formData)) {
            // Find the original field name that matches this humanized version
            const originalKey = keys(item.formData).find((key) => humanizeFieldName(key) === column);
            return originalKey ? escapeCSV(get(item, `formData.${originalKey}`, "")) : "";
          }
          return "";
      }
    });
    csvRows.push(join(row, ","));
  });

  return join(csvRows, "\n");
}
