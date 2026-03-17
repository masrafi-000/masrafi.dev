"use client";

import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const CTA = () => {
  const t = useTranslations("CTA");
  const containerRef = useRef<HTMLElement>(null);
  const textElementsRef = useRef<HTMLElement[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Text Entry Animation
      gsap.fromTo(
        textElementsRef.current,
        { 
          y: 40, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power3.out",
          willChange: "transform, opacity",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // 2. Background Orb Parallax
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          y: -100,
          scale: 1.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !textElementsRef.current.includes(el)) {
      textElementsRef.current.push(el);
    }
  };

  return (
    <Section
      variant="full"
      padding="default"
      ref={containerRef}
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      {/* Modern Background Orbs for CTA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          ref={orbRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full" 
        />
      </div>

      <Container variant="default" className="relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4">
          
          {/* Subtle availability badge */}
          <div ref={addToRefs} className="mb-6">
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-sm font-medium tracking-widest uppercase bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 backdrop-blur-md shadow-sm"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available for Work
            </Badge>
          </div>

          <SectionHeading ref={addToRefs} align="center" className="mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1] tracking-tight drop-shadow-sm">
              {t("title")}
            </h2>
          </SectionHeading>

          <p ref={addToRefs} className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light mb-10 max-w-2xl">
            {t("description")}
          </p>

          <div ref={addToRefs} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 text-base h-12 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:-translate-y-1 transition-[background-color,transform,box-shadow] duration-300"
            >
              {t("primaryButton")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 text-base h-12 bg-background/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-[background-color,border-color,color] duration-300"
            >
              {t("secondaryButton")}
            </Button>
          </div>
          
        </div>
      </Container>
    </Section>
  );
};
