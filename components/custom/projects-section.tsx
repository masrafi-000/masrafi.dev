"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { FocusRail, FocusRailItem } from "@/components/focus-rail";
import projectsData from "@/data/projects.json";
import { useTranslations } from "next-intl";
import { AnimateHeight } from "./animate-height";
import gsap from "@/lib/gsap";

export const ProjectsSection = () => {
  const t = useTranslations("Projects");
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const featuredProjects: FocusRailItem[] = projectsData
    .filter((p) => p.featured)
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      imageSrc: p.imageSrc,
      href: `/projects/${p.slug}`,
      meta: p.tech[0], // Use first tech as meta tag
    }));

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading animation
      if (headingRef.current) {
        gsap.set(headingRef.current, { willChange: "transform, opacity" });
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            onComplete: () => { gsap.set(headingRef.current!, { willChange: "auto" }); },
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Content (FocusRail) animation
      if (contentRef.current) {
        gsap.set(contentRef.current, { willChange: "transform, opacity" });
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power2.out",
            onComplete: () => { gsap.set(contentRef.current!, { willChange: "auto" }); },
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef} variant="full" className="py-24 md:py-32 bg-background overflow-hidden">
      <Container variant="default" className="relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <SectionHeading align="center">
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-foreground mb-4">
              {t("sectionTitle") || "Featured Workspace"}
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              {t("sectionSubtitle") || "A selection of my most impactful digital builds and architectural experiments."}
            </p>
          </SectionHeading>
        </div>
      </Container>
      
      <div ref={contentRef}>
        <AnimateHeight className="w-full">
          <FocusRail 
            items={featuredProjects} 
            autoPlay={true} 
            interval={5000} 
            className="w-full"
          />
        </AnimateHeight>
      </div>
    </Section>
  );
};
