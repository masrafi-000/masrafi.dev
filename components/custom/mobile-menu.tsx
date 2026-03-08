"use client";

import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { LanguageSwitcher } from "./language-switcher";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationLinks: { title: string; href: string }[];
}

export function MobileMenu({
  isOpen,
  onClose,
  navigationLinks,
}: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const controlsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Navbar");

  useEffect(() => {
    if (!containerRef.current || !overlayRef.current || !contentRef.current)
      return;

    const tl = gsap.timeline();

    if (isOpen) {
      // Make visible immediately
      gsap.set(containerRef.current, { display: "flex" });

      tl.fromTo(
        overlayRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.55, ease: "expo.out" },
      )
        .fromTo(
          linksRef.current.filter(Boolean),
          { y: 50, opacity: 0, skewY: 3 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .fromTo(
          controlsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          "-=0.1",
        );
    } else {
      tl.to(controlsRef.current, {
        y: 10,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      })
        .to(
          linksRef.current.filter(Boolean).reverse(),
          {
            y: -30,
            opacity: 0,
            duration: 0.25,
            stagger: 0.04,
            ease: "power2.in",
          },
          "-=0.1",
        )
        .to(
          overlayRef.current,
          { y: "-100%", opacity: 0, duration: 0.45, ease: "expo.in" },
          "-=0.05",
        )
        .set(containerRef.current, { display: "none" });
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-60 hidden flex-col">
      {/* Full-page overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-background dark:bg-background opacity-0 translate-y-0"
      >
        {/* Subtle texture / pattern overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/3 via-transparent to-transparent pointer-events-none" />
        {/* Thin side accent line */}
        <div className="absolute left-0 top-0 h-full w-[3px] bg-linear-to-b from-transparent via-primary to-transparent opacity-50" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col h-full px-8 py-8"
      >
        {/* Top Row: Logo + Close */}
        <div className="flex items-center justify-between w-full">
          <Link
            href="/"
            onClick={onClose}
            className="text-xl font-bold tracking-tight text-primary flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-serif italic text-lg shadow-sm">
              M
            </div>
          </Link>

          {/* Close - Same SVG, now shows X (handled in Navbar's HamburgerButton) */}
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-primary transition-colors group"
            aria-label="Close navigation menu"
          >
            {/* SVG X Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border/50 mt-8" />

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col justify-center gap-2 mt-12">
          {navigationLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                linksRef.current[i] = el as HTMLAnchorElement | null;
              }}
              onClick={onClose}
              className="group flex items-center gap-4 py-3 overflow-hidden"
            >
              {/* Index number */}
              <span className="text-xs text-muted-foreground/50 font-mono w-5 text-right shrink-0">
                0{i + 1}
              </span>
              {/* Thin separator line */}
              <span className="w-6 h-px bg-border group-hover:w-10 group-hover:bg-primary transition-all duration-300" />
              {/* Link text */}
              <span className="text-4xl sm:text-5xl font-bold tracking-tighter uppercase text-foreground group-hover:text-primary transition-colors duration-300">
                {link.title}
              </span>
            </Link>
          ))}
        </nav>

        {/* Controls Row */}
        <div
          ref={controlsRef}
          className="mt-auto pt-8 border-t border-border/50"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("language")}
              </span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Theme
              </span>
              <ToggleTheme animationType="circle-spread" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
