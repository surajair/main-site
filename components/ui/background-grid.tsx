import { cn } from "@/lib/utils";
import { ChaiStyles } from "chai-next/blocks";

interface GridBackgroundProps {
  patternType?: "grid" | "dots" | "grid-fade" | "dots-fade";
  gridSize?: "sm" | "md" | "lg" | "xl";
  gridColor?:
    | "gray"
    | "slate"
    | "zinc"
    | "neutral"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky";
  className?: string;
  styles?: ChaiStyles;
  blockProps?: Record<string, string>;
}

export default function GridBackground({
  patternType = "grid",
  gridSize = "md",
  gridColor = "gray",
  styles,
  blockProps,
}: GridBackgroundProps) {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
  };

  const colorMap = {
    gray: "#80808012",
    slate: "#64748b12",
    zinc: "#71717a12",
    neutral: "#73737312",
    red: "#ef444412",
    orange: "#f9731612",
    amber: "#f59e0b12",
    yellow: "#eab30812",
    lime: "#84cc1612",
    green: "#22c55e12",
    emerald: "#10b98112",
    teal: "#14b8a612",
    cyan: "#06b6d412",
    sky: "#0ea5e912",
  };

  const patterns = {
    grid: `bg-[linear-gradient(to_right,${colorMap[gridColor]}_1px,transparent_1px),linear-gradient(to_bottom,${colorMap[gridColor]}_1px,transparent_1px)]`,
    dots: `bg-[radial-gradient(circle,${colorMap[gridColor]}_1px,transparent_1px)]`,
    "grid-fade": `bg-[linear-gradient(to_right,${colorMap[gridColor]}_1px,transparent_1px),linear-gradient(to_bottom,${colorMap[gridColor]}_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]`,
    "dots-fade": `bg-[radial-gradient(circle,${colorMap[gridColor]}_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]`,
  };

  return (
    <div
      {...blockProps}
      {...styles}
      className={cn(patterns[patternType], styles?.className)}
      style={{
        backgroundSize: `${sizeMap[gridSize]} ${sizeMap[gridSize]}`,
      }}
    />
  );
}
