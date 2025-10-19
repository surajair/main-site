import { cn } from "@/lib/utils";
import { ChaiStyles } from "chai-next/blocks";

interface DiagonalStripesBackgroundProps {
  angle?: 45 | 135 | 225 | 315;
  stripeColor?: "gray" | "slate" | "zinc" | "neutral" | "blue" | "purple" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky";
  stripeWidth?: "thin" | "normal" | "thick";
  spacing?: "tight" | "normal" | "loose";
  fixed?: boolean;
  className?: string;
  styles?: ChaiStyles;
  blockProps?: Record<string, string>;
}

export default function DiagonalStripesBackground({
  angle = 45,
  stripeColor = "gray",
  stripeWidth = "thin",
  spacing = "normal",
  fixed = false,
  className = "",
  styles,
  blockProps,
}: DiagonalStripesBackgroundProps) {
  const widthMap = {
    thin: "1px",
    normal: "2px",
    thick: "3px",
  };

  const spacingMap = {
    tight: "6px 6px",
    normal: "10px 10px",
    loose: "16px 16px",
  };

  const colorMap = {
    gray: "#e1e1e1",
    slate: "#cbd5e1",
    zinc: "#d4d4d8",
    neutral: "#d4d4d4",
    blue: "#bfdbfe",
    purple: "#e9d5ff",
    red: "#fecaca",
    orange: "#fed7aa",
    amber: "#fde68a",
    yellow: "#fef08a",
    lime: "#d9f99d",
    green: "#bbf7d0",
    emerald: "#a7f3d0",
    teal: "#99f6e4",
    cyan: "#a5f3fc",
    sky: "#bae6fd",
  };

  const stripePattern = `bg-[repeating-linear-gradient(${angle}deg,${colorMap[stripeColor]}_0,${colorMap[stripeColor]}_${widthMap[stripeWidth]},transparent_${widthMap[stripeWidth]},transparent_50%)]`;

  return (
    <div
      {...blockProps}
      {...styles}
      className={cn(stripePattern, fixed ? "bg-fixed" : "", styles?.className)}
      style={{
        backgroundSize: spacingMap[spacing],
      }}
    />
  );
}
