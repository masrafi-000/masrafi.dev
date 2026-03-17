"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "@/lib/gsap";

interface AnimateHeightProps {
  children: React.ReactNode;
  duration?: number;
  ease?: string;
  className?: string;
}

/**
 * AnimateHeight — Production Grade
 *
 * Smoothly animates height changes using GSAP when child content dimensions change.
 * Uses ResizeObserver with a requestAnimationFrame debounce to batch rapid
 * resize callbacks into a single animation frame, preventing jank.
 */
export const AnimateHeight: React.FC<AnimateHeightProps> = ({
  children,
  duration = 0.5,
  ease = "power3.inOut",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // Hint to the GPU that this element's height will change
    container.style.willChange = "height";

    const animateHeight = () => {
      const newHeight = content.offsetHeight;
      const oldHeight = prevHeightRef.current;

      // Skip if height hasn't changed
      if (oldHeight === null || oldHeight === newHeight) {
        prevHeightRef.current = newHeight;
        return;
      }

      const isGrowing = newHeight > oldHeight;

      gsap.to(container, {
        height: newHeight,
        duration,
        ease,
        overwrite: "auto",
        onStart: () => {
          // Only clip when shrinking to prevent visual overflow bleed
          container.style.overflow = isGrowing ? "visible" : "hidden";
        },
        onComplete: () => {
          // Restore auto so the container re-adapts if the parent reflowss
          gsap.set(container, { height: "auto", overflow: "visible" });
          // Remove hint after animation to free GPU memory
          container.style.willChange = "auto";
        },
      });

      prevHeightRef.current = newHeight;
    };

    const resizeObserver = new ResizeObserver(() => {
      // Debounce via requestAnimationFrame: batch all resize callbacks
      // that fire within the same frame into a single animation call
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animateHeight);
    });

    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafRef.current);
      container.style.willChange = "auto";
    };
  }, [duration, ease]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: "hidden", height: "auto" }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};
