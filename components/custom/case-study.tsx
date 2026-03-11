"use client";

import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const CaseStudy = () => {
  const t = useTranslations("CaseStudy");
  const sectionRef = useRef<HTMLElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);

  const steps = [
    {
      id: "01",
      title: t("problemTitle"),
      desc: t("problemDesc"),
      align: "right", // Content on right, dot on left (desktop)
    },
    {
      id: "02",
      title: t("solutionTitle"),
      desc: t("solutionDesc"),
      align: "left",  // Content on left, dot on right (desktop)
    },
    {
      id: "03",
      title: t("techStackTitle"),
      desc: t("techStackDesc"),
      align: "right",
    },
    {
      id: "04",
      title: t("resultTitle"),
      desc: t("resultDesc"),
      align: "left",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Animate the central vertical line drawing itself
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "bottom center",
              scrub: 1, // Smooth scrubbing effect linked to scroll
            },
          }
        );
      }

      // 2. Animate each step sliding in
      stepRefs.current.forEach((step, index) => {
        if (!step) return;
        
        // Determine direction based on index parity (or align property if strictly followed)
        // Here we just alternate left/right for the desktop view effect
        const xOffset = index % 2 === 0 ? 50 : -50; 
        
        gsap.fromTo(
          step,
          { 
            opacity: 0, 
            x: xOffset,
            y: 30 
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            willChange: "transform, opacity",
            scrollTrigger: {
              trigger: step,
              start: "top 85%", // Trigger when the top of the step is 85% down the viewport
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !stepRefs.current.includes(el)) {
      stepRefs.current.push(el);
    }
  };

  return (
    <Section ref={sectionRef} variant="full" className="py-24 md:py-32 bg-background relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <Container variant="default" className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <SectionHeading align="center">
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-foreground mb-4">
              {t("sectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              {t("sectionSubtitle")}
            </p>
          </SectionHeading>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line Container */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-px bg-border/40">
            {/* Animated Draw Line */}
            <div 
              ref={timelineLineRef} 
              className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-primary via-primary/50 to-transparent" 
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-12 md:gap-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={step.id} 
                  ref={addToRefs}
                  className={`relative flex flex-col md:flex-row w-full ${isEven ? 'md:justify-start' : 'md:justify-end'} items-start md:items-center`}
                >
                  
                  {/* Timeline Dot (Mobile & Desktop) */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-background border-4 border-background shadow-md shadow-primary/10 z-20">
                    <div className="flex items-center justify-center w-full h-full rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {step.id}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${isEven ? 'md:pr-12 lg:pr-16 text-left md:text-right' : 'md:pl-12 lg:pl-16 text-left'}`}>
                    <div className="bg-background/40 backdrop-blur-md border border-border/50 p-6 md:p-8 hover:bg-background/60 hover:border-border transition-colors duration-300 relative group overflow-hidden shadow-sm">
                      
                      {/* Subtle hover gradient inside card */}
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};
