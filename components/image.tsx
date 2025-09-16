import { ChaiBlockComponentProps, ChaiStyles } from "chai-next/blocks";
import { first, isArray } from "lodash";
import Image from "next/image";
import * as React from "react";
import { IMAGE_DOMAINS } from "../remote-pattern";

// Helper function to check if image domain is allowed
const isImageDomainAllowed = (imageUrl: string): boolean => {
  try {
    const url = new URL(imageUrl);
    return IMAGE_DOMAINS.includes(url.hostname);
  } catch {
    // If URL parsing fails, assume it's a relative path or invalid URL
    return true;
  }
};

export const ImageBlock = (
  props: ChaiBlockComponentProps<{
    height: string;
    width: string;
    alt: string;
    styles: ChaiStyles;
    lazyLoading: boolean;
    image: string;
  }>,
): React.ReactElement => {
  const { image, styles, alt, height, width, lazyLoading } = props;

  // If width or height are missing/invalid, use fill mode
  const shouldUseFill = !width || !height || isNaN(parseInt(width)) || isNaN(parseInt(height));

  // Get the image source
  const imageSrc = isArray(image) ? first(image)?.trimEnd() : image?.trimEnd();

  // Check if the image domain is allowed for optimization
  const shouldOptimize = imageSrc ? isImageDomainAllowed(imageSrc) : true;

  const imageElement = React.createElement(Image, {
    ...styles,
    src: imageSrc,
    alt: alt || "",
    priority: !lazyLoading,
    fill: shouldUseFill,
    height: shouldUseFill ? undefined : parseInt(height),
    width: shouldUseFill ? undefined : parseInt(width),
    style: shouldUseFill ? { objectFit: "cover" } : undefined,
    unoptimized: !shouldOptimize, // Only disable optimization for domains not in IMAGE_DOMAINS
  });

  if (shouldUseFill) {
    return React.createElement("div", { className: "relative flex w-full h-full" }, imageElement);
  }

  return imageElement;
};
