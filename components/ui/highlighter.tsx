"use client";

import { useInView } from "motion/react";
import type React from "react";
import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import { type RoughAnnotation } from "rough-notation/lib/model";

type AnnotationAction = "highlight" | "underline" | "box" | "circle" | "strike-through" | "crossed-off" | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  blockProps?: Record<string, string>;
  isView?: boolean;
}

export function Highlighter({
  children,
  blockProps,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  });

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView;

  useEffect(() => {
    if (!shouldShow) return;

    const element = elementRef.current;
    if (!element) return;

    // Clean up any existing annotation first
    if (annotationRef.current) {
      annotationRef.current.remove();
      annotationRef.current = null;
    }

    const annotationConfig = {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    };

    console.log("Should show", shouldShow, "Action:", action);

    const annotation = annotate(element, annotationConfig);
    annotationRef.current = annotation;
    annotation.show();

    const resizeObserver = new ResizeObserver(() => {
      if (annotationRef.current) {
        annotationRef.current.remove();
      }
      const newAnnotation = annotate(element, annotationConfig);
      annotationRef.current = newAnnotation;
      newAnnotation.show();
    });

    resizeObserver.observe(element);
    resizeObserver.observe(document.body);

    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove();
        annotationRef.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [shouldShow, action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

  return (
    <span
      {...blockProps}
      onDoubleClick={(e) => e.stopPropagation()}
      ref={elementRef}
      className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
