"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface AnimateHeightProps {
  children: React.ReactNode;
  duration?: number;
  ease?: string;
  className?: string;
}

export const AnimateHeight: React.FC<AnimateHeightProps> = ({
  children,
  duration = 0.5,
  ease = "power3.inOut",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    const animateHeight = () => {
      const newHeight = content.offsetHeight;
      const oldHeight = prevHeightRef.current;

      if (oldHeight !== null && oldHeight !== newHeight) {
        // Only trigger overflow change if absolutely necessary
        const isGrowing = newHeight > oldHeight;
        
        gsap.to(container, {
          height: newHeight,
          duration,
          ease,
          overwrite: "auto",
          style: { transformStyle: "preserve-3d" }, // Ensure 3D context is not broken
          onStart: () => {
            if (isGrowing) {
              gsap.set(container, { overflow: "visible" }); // Allow 3D elements to poke out while growing
            } else {
              gsap.set(container, { overflow: "hidden" });
            }
          },
          onComplete: () => {
            gsap.set(container, { height: "auto", overflow: "visible" });
          },
        });
      }
      prevHeightRef.current = newHeight;
    };

    const resizeObserver = new ResizeObserver(() => {
      animateHeight();
    });

    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
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
