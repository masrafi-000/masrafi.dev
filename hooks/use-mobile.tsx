"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 1024;

/**
 * useIsMobile — Production Grade
 *
 * Uses the `matchMedia` API instead of a `resize` event listener.
 * This fires ONLY when the breakpoint is crossed (not on every pixel),
 * saving 60+ unnecessary state updates per second during resize.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Set initial value
    setIsMobile(mql.matches);

    // Modern API: addEventListener (replaces deprecated addListener)
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
