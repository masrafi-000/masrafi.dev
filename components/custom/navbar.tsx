"use client";

import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import MasrafiLogo from "./logo";

function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  const topBarRef = useRef<SVGLineElement>(null);
  const botBarRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!topBarRef.current || !botBarRef.current) return;
    if (isOpen) {
      // Morph to X
      gsap.to(topBarRef.current, {
        attr: { x1: 6, y1: 6, x2: 22, y2: 22 },
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(botBarRef.current, {
        attr: { x1: 22, y1: 6, x2: 6, y2: 22 },
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else {
      // Morph back to two bars
      gsap.to(topBarRef.current, {
        attr: { x1: 4, y1: 10, x2: 24, y2: 10 },
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(botBarRef.current, {
        attr: { x1: 4, y1: 18, x2: 24, y2: 18 },
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line ref={topBarRef} x1="4" y1="10" x2="24" y2="10" />
        <line ref={botBarRef} x1="4" y1="18" x2="24" y2="18" />
      </svg>
    </button>
  );
}

export const Navbar = () => {
  const t = useTranslations("Navbar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const NavigationLinks = [
    { title: t("home"), href: "/" },
    { title: t("about"), href: "/about" },
    { title: t("projects"), href: "/projects" },
    { title: t("contact"), href: "/contact" },
    { title: t("blog"), href: "/blog" },
  ];

  useEffect(() => {
    if (!mobileMenuRef.current || !headerRef.current || !innerRef.current)
      return;

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    if (isMobileMenuOpen) {
      // 1) Show the mobile menu container immediately so its flex layout can be measured
      gsap.set(mobileMenuRef.current, {
        display: "flex",
        height: "auto",
        opacity: 0,
      });

      // 2) Expand the outer header to full width and top 0
      tl.to(
        headerRef.current,
        {
          width: "100%",
          top: "0px",
          duration: 0.5,
        },
        0,
      )
        // 3) Expand the inner glass container to full viewport height and remove border radius
        .to(
          innerRef.current,
          {
            borderRadius: "0px",
            height: "100dvh",
            duration: 0.5,
          },
          0,
        )
        // 4) Fade in the links and controls over the expanding background
        .to(
          mobileMenuRef.current,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          0.2,
        );
    } else {
      // 1) Fade out the mobile menu content fully first
      tl.to(
        mobileMenuRef.current,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.inOut",
        },
        0,
      )
        // 2) Hide the content from layout so it doesn't artificially stretch the container during shrink
        .set(mobileMenuRef.current, { display: "none" }, 0.25)
        // 3) Contract the inner glass container back to auto height and rounded corners
        .to(
          innerRef.current,
          {
            borderRadius: "4px",
            height: "auto",
            duration: 0.5,
          },
          0.25,
        )
        // 4) Contract the outer header back to original pill width and top margin
        .to(
          headerRef.current,
          {
            width: "95%",
            top: "1.5rem", // top-6
            duration: 0.5,
          },
          0.25,
        );
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 container mx-auto"
    >
      <div
        ref={innerRef}
        className="backdrop-blur-xl bg-background/90 dark:bg-muted/80  border border-border/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] px-6 py-4 flex flex-col overflow-hidden"
      >
        {/* Top Row  */}
        <div className="flex items-center justify-between w-full shrink-0">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-bold tracking-tight text-primary flex items-center gap-2"
          >
            <MasrafiLogo />
          </Link>

          {/* Navigation Links - Desktop Only */}
          <nav className="hidden md:flex gap-8 items-center">
            {NavigationLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Controls - Desktop Only */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ToggleTheme animationType="circle-spread" className="scale-90" />
          </div>

          {/* Animated SVG Hamburger - Mobile Only */}
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          />
        </div>

        {/* Expandable Mobile Menu Area (Inside Navbar) */}
        <div
          ref={mobileMenuRef}
          className="md:hidden w-full h-0 opacity-0 hidden flex-col flex-1 mt-8 overflow-y-auto"
        >
          <div className="flex-1 flex flex-col justify-center gap-6 mb-8">
            {NavigationLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold uppercase tracking-tight text-foreground hover:text-primary transition-colors block border-b border-border/20 dark:border-white/5 pb-4"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border/20 shrink-0 mt-auto pb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {t("language") || "Language"}
              </span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Theme
              </span>
              <ToggleTheme animationType="circle-spread" className="scale-90" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
