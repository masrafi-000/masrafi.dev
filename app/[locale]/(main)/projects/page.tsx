"use client";

import React from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects.json";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const t = useTranslations("Projects");

  return (
    <main className="pt-24 min-h-screen bg-background">
      <Section variant="full" className="py-20">
        <Container variant="default">
          <SectionHeading align="left" className="mb-16">
            <h1 className="text-5xl md:text-7xl font-serif tracking-tighter text-foreground mb-6">
              {t("all")} <span className="italic font-light text-primary">{t("projects")}</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl">
              {t("archiveDescription")}
            </p>
          </SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsData.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative flex flex-col bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10" />
                
                {/* Image Container */}
                <div className="relative aspect-16/10 overflow-hidden bg-muted">
                   <Image
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/0 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px] uppercase tracking-widest font-bold bg-primary/5 text-primary border-primary/10">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-light leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest text-primary gap-2">
                    {t("viewProject")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
