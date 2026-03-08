"use client";

import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

export const Hero = () => {
  const t = useTranslations("Hero");
  const containerRef = useRef<HTMLElement>(null);
  const textElementsRef = useRef<HTMLElement[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);

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

      // Add a subtle floating animation
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
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
      padding="none"
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-36 md:pt-24 pb-12 overflow-hidden bg-background"
    >
      {/* Modern Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-purple-500/10 dark:bg-purple-900/10 blur-[120px]" />
      </div>

      <Container variant="default" className=" z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Content Column */}
          <div className="flex flex-col gap-6 w-full px-4 py-4 relative z-20">
            {/* Subtitle with accent line */}
            <div ref={addToRefs} className="flex items-center gap-4">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <span className="text-sm tracking-widest uppercase font-semibold text-muted-foreground">
                {t("subtitle")}
              </span>
            </div>

            {/* Main Elegant Heading */}
            <div>
              <SectionHeading ref={addToRefs} align="left">
                <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-serif text-foreground leading-[1.1] tracking-tight w-full">
                  {t("titleLine1")}{" "}
                  <span className="italic font-light text-primary">
                    {t("titleLine2")}{" "}
                  </span>
                  {t("titleLine3")}
                </h1>
              </SectionHeading>
            </div>

            {/* Description */}
            <div ref={addToRefs}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4 max-w-xl font-light">
                {t("description")}
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div
              ref={addToRefs}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <Button
                size="lg"
                className="rounded-full px-8 text-base h-12 shadow-lg hover:shadow-primary/25"
              >
                {t("primaryButton")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base h-12 bg-transparent border-2 border-border hover:border-foreground"
              >
                {t("secondaryButton")}
              </Button>
            </div>
          </div>

          {/* Right Image Column (Frameless, integrated look) */}
          <div className="relative h-full flex justify-center items-center lg:justify-end z-10">
            <div
              ref={imageRef}
              className="relative w-full max-w-lg aspect-square lg:aspect-4/5 flex items-center justify-center p-8"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent dark:from-primary/5 rounded-full blur-3xl opacity-70" />
              <div className="relative z-10 pointer-events-none select-none text-center">
                <span className="font-serif italic text-3xl md:text-4xl text-muted-foreground/50 tracking-wide">
                  Floating <br /> Portrait Cutout
                </span>
                {/* 
                    When ready, place Next.js Image here:
                    <Image src="..." alt="..." fill className="object-contain drop-shadow-2xl" priority />
                  */}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
