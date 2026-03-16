"use client";

import React from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { FocusRail, FocusRailItem } from "@/components/focus-rail";
import projectsData from "@/data/projects.json";
import { useTranslations } from "next-intl";

export const ProjectsSection = () => {
  const t = useTranslations("Projects");
  
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

  return (
    <Section variant="full" className="py-24 md:py-32 bg-background overflow-hidden">
      <Container variant="default" className="relative z-10">
        <div className="text-center mb-16">
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
        <div className="w-full">
          <FocusRail 
            items={featuredProjects} 
            autoPlay={true} 
            interval={5000} 
            className="w-full"
          />
        </div>
    </Section>
  );
};
