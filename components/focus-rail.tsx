"use client";

import * as React from "react";
import { motion, AnimatePresence, PanInfo, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  githubUrl?: string;
  liveUrl?: string;
  meta?: string;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

/**
 * Helper to wrap indices (e.g., -1 becomes length-1)
 */
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Physics Configuration
 * Base spring for spatial movement (x/z)
 */
const BASE_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}: FocusRailProps) {
  const isMobile = useIsMobile();
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  // --- NAVIGATION HANDLERS ---
  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);



  // Autoplay logic
  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  // --- SWIPE / DRAG LOGIC ---
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "group relative flex min-h-[650px] md:min-h-[850px] w-full flex-col overflow-hidden bg-background text-foreground outline-none select-none overflow-x-hidden pb-12",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeItem.imageSrc}
              alt=""
              fill
              className="h-full w-full object-cover blur-3xl saturate-200"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Stage */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
        {/* DRAGGABLE RAIL CONTAINER */}
        <motion.div
          className="relative mx-auto flex h-[400px] md:h-[600px] w-full max-w-6xl items-center justify-center perspective-distant cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            // Dynamic transforms
            const xOffset = offset * (isMobile ? 260 : 450);
            const zOffset = -dist * (isMobile ? 120 : 180);
            const scale = isCenter ? 1 : 0.85;
            const rotateY = offset * -20;

            const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
            const blur = isCenter ? 0 : dist * 6;
            const brightness = isCenter ? 1 : 0.5;

            return (
              <motion.div
                key={absIndex}
                suppressHydrationWarning
                className={cn(
                  "absolute aspect-3/4 w-[300px] md:w-[450px] rounded-2xl border border-border bg-card shadow-2xl transition-shadow duration-300 overflow-hidden",
                  isCenter ? "z-20 shadow-primary/5" : "z-10"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale: scale, // Trigger "tap" via TAP_SPRING when this changes
                  rotateY: rotateY,
                  opacity: opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={BASE_SPRING}
                style={{
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="h-full w-full rounded-2xl object-cover pointer-events-none"
                  sizes="(max-width: 768px) 300px, 450px"
                  priority={isCenter}
                />

                {/* Lighting layers */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-foreground/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-white/5 pointer-events-none mix-blend-multiply dark:mix-blend-overlay" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info & Controls */}
        <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col items-center justify-between gap-8 lg:flex-row pointer-events-auto">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left min-h-[8rem] justify-center flex-1 w-full">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, position: "absolute" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full"
                >
                  {activeItem.meta && (
                    <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                      {activeItem.meta}
                    </span>
                  )}
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground mt-1">
                    {activeItem.title}
                  </h2>
                  {activeItem.description && (
                    <p className="max-w-md mx-auto lg:mx-0 text-muted-foreground mt-2">
                      {activeItem.description}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-1 rounded-full bg-muted/80 p-1 ring-1 ring-border backdrop-blur-md mx-auto sm:mx-0">
              <button
                onClick={handlePrev}
                className="rounded-full p-3 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-[40px] text-center text-xs font-mono text-neutral-500">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full p-3 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3">
              {activeItem.href && (
                <Link
                  href={activeItem.href}
                  className="group flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:scale-105 active:scale-95 flex-1 sm:flex-none justify-center"
                >
                  Project Details
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              )}
              {activeItem.liveUrl && (
                <Link
                  href={activeItem.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-sm p-3 text-sm font-medium text-foreground transition-all hover:bg-muted hover:scale-105 active:scale-95 shadow-sm"
                  title="Live Project"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="sr-only">Live Project</span>
                </Link>
              )}
              {activeItem.githubUrl && (
                <Link
                  href={activeItem.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-sm p-3 text-sm font-medium text-foreground transition-all hover:bg-muted hover:scale-105 active:scale-95 shadow-sm"
                  title="GitHub Repository"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}