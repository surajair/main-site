"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  // Track the checked state to control thumb position directly
  const isChecked = props.checked || props.defaultChecked || false;

  return (
    <SwitchPrimitives.Root
      className={cn(
        // Base styles with 43px width
        "peer inline-flex h-6 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        // Original theme-based styles (for production)
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        // Fallback styles using standard Tailwind classes (for editor)
        "[&[data-state='checked']]:bg-blue-600 [&[data-state='unchecked']]:bg-gray-300",
        // Additional fallback using attribute selectors
        "[&[aria-checked='true']]:bg-blue-600 [&[aria-checked='false']]:bg-gray-300",
        className,
      )}
      style={{
        width: "43px",
        backgroundColor: isChecked ? "#2563eb" : "#d1d5db", // Direct fallback colors
      }}
      {...props}
      ref={ref}>
      <SwitchPrimitives.Thumb
        className={cn(
          // Base thumb styles
          "pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-all duration-200 ease-in-out bg-white",
          // CSS class fallbacks (might not work in editor)
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
          "[&[data-state='checked']]:translate-x-5 [&[data-state='unchecked']]:translate-x-0.5",
          "[&[aria-checked='true']]:translate-x-5 [&[aria-checked='false']]:translate-x-0.5",
        )}
        style={{
          // Direct inline style to ensure movement works
          transform: isChecked ? "translateX(20px)" : "translateX(2px)",
          backgroundColor: "#ffffff",
          transition: "transform 0.2s ease-in-out",
        }}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
