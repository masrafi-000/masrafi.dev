"use client";

import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTerminalStore } from "@/store/terminal-store";
import { Terminal as TerminalIcon } from "lucide-react";
import Terminal from "@/components/custom/terminal";
import modernHero from "@/public/images/hero.png";

export const Hero = () => {
  const t = useTranslations("Hero");
  const containerRef = useRef<HTMLElement>(null);
  const textElementsRef = useRef<HTMLElement[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isOpen, isMinimized, setMinimized, openTerminal } = useTerminalStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // Stagger text elements
    tl.fromTo(
      textElementsRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    );

    // Fade in and float image
    if (imageRef.current) {
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5",
      );
    }

    // Terminal Entrance
    if (terminalRef.current) {
        tl.fromTo(
            terminalRef.current,
            { opacity: 0, x: 50, scale: 0.8 },
            { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
            "-=0.7"
        );
    }
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
      {/* Modern Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-[10%] w-[500px] h-[500px]   bg-blue-500/10 dark:bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] -right-[5%] w-[600px] h-[600px]   bg-purple-500/10 dark:bg-purple-900/10 blur-[120px]" />
      </div>

      <Container variant="default" className=" z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full ">
          {/* Left Content Column */}
          <div className="flex flex-col gap-6 w-full px-4 py-4 relative z-20">
            {/* Modern Subtitle Badge */}
            <div ref={addToRefs} className="flex items-start mt-20 2xl:mt-0">
              <Badge
                variant="outline"
                className="px-4 py-1.5 text-lg font-medium tracking-widest uppercase bg-primary/5 text-primary border-primary/20 backdrop-blur-md shadow-sm transition-all hover:bg-primary/10 hover:border-primary/30"
              >
                <span className="relative flex h-2 w-2 mr-3 ">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full   bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full  h-2 w-2 bg-primary"></span>
                </span>
                {t("greeting")}
              </Badge>
            </div>

            <SectionHeading ref={addToRefs} align="left">
              <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.05] tracking-tight w-full drop-shadow-sm">
                {t("roleLine1")}{" "}
                <span className="italic font-light bg-linear-to-r from-primary via-primary/80 to-primary/50 text-transparent bg-clip-text pr-2">
                  {t("roleLine2")}
                </span>
              </h1>
            </SectionHeading>

            {/* Description */}
            <div ref={addToRefs} className="flex flex-col gap-4 mt-2">
              <p className="text-lg md:text-xl text-accent-foreground leading-relaxed max-w-xl font-light">
                {t("description")}
              </p>

              {/* Modern Highlight Box */}
              <div className="group relative flex items-start gap-4 bg-background/30 hover:bg-background/50 backdrop-blur-xl border border-border/40 shadow-sm hover:shadow-md  p-4 sm:p-5 max-w-xl mt-4 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent  pointer-events-none opacity-50"></div>
                <div className="relative mt-0.5 shrink-0">
                  <div className="flex items-center justify-center w-8 h-8   bg-primary/10 text-primary ring-1 ring-primary/20">
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
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6 w-full"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 text-base h-12 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                {t("primaryButton")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 text-base h-12 bg-background/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300"
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
                className={`relative z-10 w-full h-full pointer-events-none select-none transition-opacity duration-500 ${isOpen && !isMinimized ? 'opacity-40 blur-xs' : 'opacity-100'}`}
              >
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent dark:from-primary/10 blur-[80px] opacity-60" />
                <Image
                  src={modernHero}
                  alt="Modern Frontend Development Workspace"
                  fill
                  className="object-contain drop-shadow-2xl relative z-10"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Terminal Overlay - Now using Portals for global z-index dominance */}
              <AnimatePresence>
                {isOpen && !isMinimized && <Terminal />}
              </AnimatePresence>

              {/* Minimized Terminal Pill */}
              <AnimatePresence>
                {isOpen && isMinimized && (
                  <motion.div
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    onClick={() => setMinimized(false)}
                    className="absolute bottom-10 right-10 z-9999 bg-[#1a1a1a] border border-primary/20 px-4 py-2 rounded-full cursor-pointer shadow-xl hover:bg-[#222] transition-all flex items-center gap-3"
                  >
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                    <span className="text-xs text-white font-mono flex items-center gap-2">
                       <TerminalIcon className="w-3 h-3 text-primary" />
                       Terminal (Minimized)
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
