"use client";

import { ToggleTheme } from "@/components/lightswind/toggle-theme";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";

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
        attr: { x1: 5, y1: 5, x2: 19, y2: 19 },
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(botBarRef.current, {
        attr: { x1: 19, y1: 5, x2: 5, y2: 19 },
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else {
      // Morph back to two bars
      gsap.to(topBarRef.current, {
        attr: { x1: 3, y1: 8, x2: 21, y2: 8 },
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(botBarRef.current, {
        attr: { x1: 3, y1: 16, x2: 21, y2: 16 },
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <line ref={topBarRef} x1="3" y1="8" x2="21" y2="8" />
        <line ref={botBarRef} x1="3" y1="16" x2="21" y2="16" />
      </svg>
    </button>
  );
}

export const Navbar = () => {
  const t = useTranslations("Navbar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavigationLinks = [
    { title: t("home"), href: "/" },
    { title: t("about"), href: "/about" },
    { title: t("projects"), href: "/projects" },
    { title: t("contact"), href: "/contact" },
    { title: t("blog"), href: "/blog" },
  ];

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] ">
        <div className="backdrop-blur-xl bg-background/90 dark:bg-muted/80 rounded-sm border border-border/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-serif italic text-lg shadow-sm">
              M
            </div>
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
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationLinks={NavigationLinks}
      />
    </>
  );
};
