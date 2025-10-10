"use client";

import React from "react";

type ShimmerButtonComponentProps = {
  text: string;
  shimmerColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  animationDuration?: number;
  blockProps: React.HTMLAttributes<HTMLButtonElement>;
  styles: any;
};

const ShimmerButtonComponent = ({
  text,
  shimmerColor = "#06b6d4",
  backgroundColor = "#000000",
  textColor = "#ffffff",
  borderRadius = "9999px",
  animationDuration = 2500,
  blockProps,
  styles,
}: ShimmerButtonComponentProps) => {
  const customCss = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;

  return (
    <>
      <style>{customCss}</style>
      <button
        {...blockProps}
        {...styles}
        className={`${styles?.className || ""} relative inline-flex items-center justify-center p-[1.5px] rounded-full overflow-hidden group`}
        style={{
          ...styles?.style,
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          borderRadius,
        }}
      >
        {/* Animated shimmer border */}
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from var(--angle), transparent 25%, ${shimmerColor}, transparent 50%)`,
            animation: `shimmer-spin ${animationDuration}ms linear infinite`,
          }}
        />

        {/* Button content */}
        <span
          className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-3 rounded-full group-hover:opacity-90 transition-opacity duration-300"
          style={{
            backgroundColor: backgroundColor || styles?.backgroundColor,
            color: textColor || styles?.color,
            borderRadius,
          }}
        >
          {text}
        </span>
      </button>
    </>
  );
};

export default ShimmerButtonComponent;
