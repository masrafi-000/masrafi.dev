"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

type AnimationType =
  | "none"
  | "circle-spread"
  | "round-morph"
  | "swipe-left"
  | "swipe-up"
  | "diag-down-right"
  | "fade-in-out"
  | "shrink-grow"
  | "flip-x-in"
  | "split-vertical"
  | "swipe-right"
  | "swipe-down"
  | "wave-ripple";

interface ToggleThemeProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  animationType?: AnimationType;
}


export const ToggleTheme = ({
  className,
  duration = 400,
  animationType = "circle-spread",
  ...props
}: ToggleThemeProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const setMountedRef = useCallback((node: HTMLButtonElement | null) => {
    if (node) setMounted(true);
  }, []);


  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = isDark ? "light" : "dark";

 
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    switch (animationType) {
      case "circle-spread":
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "round-morph":
        document.documentElement.animate(
          [
            { opacity: 0, transform: "scale(0.8) rotate(5deg)" },
            { opacity: 1, transform: "scale(1) rotate(0deg)" },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "swipe-left":
        document.documentElement.animate(
          { clipPath: [`inset(0 0 0 ${viewportWidth}px)`, `inset(0 0 0 0)`] },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "swipe-up":
        document.documentElement.animate(
          { clipPath: [`inset(${viewportHeight}px 0 0 0)`, `inset(0 0 0 0)`] },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "diag-down-right":
        document.documentElement.animate(
          {
            clipPath: [
              `polygon(0 0, 0 0, 0 0, 0 0)`,
              `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
            ],
          },
          {
            duration: duration * 1.5,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "fade-in-out":
        document.documentElement.animate(
          { opacity: [0, 1] },
          {
            duration: duration * 0.5,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "shrink-grow":
        document.documentElement.animate(
          [
            { transform: "scale(0.9)", opacity: 0 },
            { transform: "scale(1)", opacity: 1 },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.19, 1, 0.22, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        document.documentElement.animate(
          [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(1.05)", opacity: 0 },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.19, 1, 0.22, 1)",
            pseudoElement: "::view-transition-old(root)",
          },
        );
        break;

      case "flip-x-in": {
        const styleEl = document.createElement("style");
        styleEl.textContent = `
          ::view-transition-group(root) { perspective: 1000px; }
          ::view-transition-old(root)  { transform-origin: center; animation: flip-out ${duration}ms forwards; }
          ::view-transition-new(root)  { transform-origin: center; animation: flip-in  ${duration}ms forwards; }
          @keyframes flip-out { from { transform: rotateY(0deg);   opacity: 1; } to { transform: rotateY(-90deg); opacity: 0; } }
          @keyframes flip-in  { from { transform: rotateY(90deg);  opacity: 0; } to { transform: rotateY(0deg);   opacity: 1; } }
        `;
        document.head.appendChild(styleEl);
        setTimeout(() => styleEl.remove(), duration * 2);
        break;
      }

      case "split-vertical":
        document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: duration * 0.75,
          easing: "ease-in",
          pseudoElement: "::view-transition-new(root)",
        });
        document.documentElement.animate(
          [
            { clipPath: "inset(0 0 0 0)", transform: "none" },
            { clipPath: "inset(0 40% 0 40%)", transform: "scale(1.2)" },
            { clipPath: "inset(0 50% 0 50%)", transform: "scale(1)" },
          ],
          {
            duration: duration * 1.5,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-old(root)",
          },
        );
        break;

      case "swipe-right":
        document.documentElement.animate(
          { clipPath: [`inset(0 ${viewportWidth}px 0 0)`, `inset(0 0 0 0)`] },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "swipe-down":
        document.documentElement.animate(
          { clipPath: [`inset(0 0 ${viewportHeight}px 0)`, `inset(0 0 0 0)`] },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "wave-ripple":
        document.documentElement.animate(
          {
            clipPath: [`circle(0% at 50% 50%)`, `circle(${maxRadius}px at 50% 50%)`],
          },
          {
            duration: duration * 1.5,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        break;

      case "none":
      default:
        break;
    }
  }, [isDark, duration, animationType, setTheme]);

  return (
    <>
      <button
        ref={(node) => { buttonRef.current = node; setMountedRef(node); }}
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          isDark ? "bg-primary" : "bg-muted-foreground/30",
          className,
        )}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        {...props}
      >
        <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
        <span
          className={cn(
            "pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out z-10",
            isDark ? "translate-x-5" : "translate-x-0",
          )}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-primary" />
          ) : (
            <Sun className="h-3 w-3 text-amber-500" />
          )}
        </span>
      </button>

      {animationType !== "flip-x-in" && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              ::view-transition-old(root),
              ::view-transition-new(root) {
                animation: none;
                mix-blend-mode: normal;
              }
            `,
          }}
        />
      )}
    </>
  );
};
