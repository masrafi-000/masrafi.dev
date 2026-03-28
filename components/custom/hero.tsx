"use client";

import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import Terminal from "@/components/custom/terminal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import gsap, { ScrollTrigger } from "@/lib/gsap";
import modernHero from "@/public/images/hero.png";
import { useTerminalStore } from "@/store/terminal-store";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";

export const Hero = () => {
  const t = useTranslations("Hero");
  const containerRef = useRef<HTMLElement>(null);
  const textElementsRef = useRef<HTMLElement[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isOpen, isMinimized, setMinimized, openTerminal } = useTerminalStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const texts = Array.isArray(textElementsRef.current)
        ? textElementsRef.current
        : [textElementsRef.current];

      // Prepare elements for GPU
      gsap.set(texts, {
        y: 40,
        opacity: 0,
        rotateX: 10,
        transformOrigin: "0 50%",
        force3D: true,
      });
      
      if (imageRef.current) {
        gsap.set(imageRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 20,
          autoAlpha: 0,
          force3D: true,
        });
      }
      
      if (terminalRef.current) {
        gsap.set(terminalRef.current, {
          opacity: 0,
          x: 40,
          scale: 0.95,
          force3D: true,
        });
      }

      // Snappy and elegant text stagger entrance
      tl.to(texts, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.1,
      });

      // Image fade-in with smooth float
      if (imageRef.current) {
        tl.to(
          imageRef.current,
          { opacity: 1, autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: "power4.out" },
          "-=0.7",
        );
      }

      // Terminal pop-in
      if (terminalRef.current) {
        tl.to(
          terminalRef.current,
          { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "back.out(1.2)" },
          "-=0.8",
        );
      }

      // Optional ScrollTrigger refresh if the page height shifts
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !textElementsRef.current.includes(el)) {
      textElementsRef.current.push(el);
    }
  };

  return (
    <Section
      variant="full"
      padding="default"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Modern Background Orbs, CSS animated instead of JS scrubbed for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full animate-pulse opacity-50 will-change-transform" />
        <div className="absolute bottom-[-10%] -right-[5%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-900/10 blur-[120px] rounded-full animate-pulse opacity-50 will-change-transform animation-delay-2000" />
      </div>

      <Container variant="default" className="z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content Column */}
          <div className="flex flex-col gap-6 w-full px-4 py-4 relative z-20">
            {/* Modern Subtitle Badge */}
            <div ref={addToRefs} className="flex items-start mt-20 2xl:mt-0 will-change-transform max-w-fit">
              <Badge
                variant="outline"
                className="px-4 py-1.5 text-lg font-medium tracking-widest uppercase bg-primary/5 text-primary border-primary/20 backdrop-blur-md shadow-sm transition-[background-color,border-color] hover:bg-primary/10 hover:border-primary/30"
              >
                <span className="relative flex h-2 w-2 mr-3 ">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t("greeting")}
              </Badge>
            </div>

            <SectionHeading ref={addToRefs} align="left" className="will-change-transform">
              <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.05] tracking-tight w-full drop-shadow-sm">
                {t("roleLine1")}{" "}
                <span className="italic font-light bg-linear-to-r from-primary via-primary/80 to-primary/50 text-transparent bg-clip-text pr-2">
                  {t("roleLine2")}
                </span>
              </h1>
            </SectionHeading>

            {/* Description */}
            <div ref={addToRefs} className="flex flex-col gap-4 mt-2 will-change-transform">
              <p className="text-lg md:text-xl text-accent-foreground leading-relaxed max-w-xl font-light">
                {t("description")}
              </p>

              {/* Modern Highlight Box */}
              <div className="group relative flex items-start gap-4 bg-background/30 hover:bg-background/50 backdrop-blur-md border border-border/40 shadow-sm hover:shadow-md p-4 sm:p-5 max-w-xl mt-4 transition-[background-color,box-shadow,border-color] duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none opacity-50"></div>
                <div className="relative mt-0.5 shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary ring-1 ring-primary/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                  </div>
                </div>
                <p className="relative text-sm sm:text-base font-medium text-muted-foreground leading-relaxed transition-colors group-hover:text-foreground">
                  {t("highlight")}
                </p>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div
              ref={addToRefs}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6 w-full will-change-transform"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 text-base h-12 shadow-[0_0_20px_rgba(var(--primary),0.3)] font-medium transform hover:scale-105 hover:text-white transition-all ease-in-out duration-300 delay-75 cursor-pointer"
              >
                {t("primaryButton")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 text-base h-12 bg-background/50 backdrop-blur-md font-medium border-2 border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:scale-105 transition-all ease-in-out delay-75 duration-300 cursor-pointer"
                onClick={openTerminal}
              >
                {t("secondaryButton")}
              </Button>
            </div>
          </div>

          {/* Right Column: Combined Image and Terminal */}
          <div className="relative h-full flex justify-center items-center lg:justify-end z-10 mt-10 lg:mt-0">
            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
              {/* Image with lower opacity when terminal is present for a professional look */}
              <div
                ref={imageRef}
                className="relative z-10 w-full h-full pointer-events-none select-none will-change-transform"
                style={{ opacity: 0, visibility: "hidden" }} // Pre-hidden to completely avoid flash
              >
                <div className={`relative z-10 w-full h-full transition-all duration-500 ease-out transform ${isOpen && !isMinimized ? "opacity-30 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}>
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent dark:from-primary/10 blur-[80px] opacity-60 rounded-full" />
                  <Image
                    src={modernHero}
                    alt="Modern Frontend Development Workspace"
                    fill
                    className="object-contain drop-shadow-2xl relative z-10"
                    priority
                    quality={100}
                    unoptimized={true}
                  />
                </div>
              </div>

              {/* Terminal Overlay - Now using Portals for global z-index dominance */}
              <div ref={terminalRef} className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                 <AnimatePresence>
                   {isOpen && !isMinimized && <Terminal />}
                 </AnimatePresence>
              </div>

              {/* Minimized Terminal Pill */}
              <AnimatePresence>
                {isOpen && isMinimized && (
                  <motion.div
                    drag
                    dragMomentum={false}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    onClick={() => setMinimized(false)}
                    className="absolute bottom-10 right-10 z-50 bg-[#1a1a1a] border border-primary/20 px-4 py-2 rounded-full cursor-pointer shadow-xl hover:bg-[#222] transition-all flex items-center gap-3 will-change-transform"
                  >
                    <div className="relative flex h-2 w-2 pointer-events-none">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                    <span className="text-xs text-white font-mono flex items-center gap-2 pointer-events-none">
                      <TerminalIcon className="w-3 h-3 text-primary" />
                      CLI
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
