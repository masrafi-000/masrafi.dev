"use client";

import React from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import projectsData from "@/data/projects.json";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ProjectDetailsPage({ params }: { params: { slug: string } }) {
  const t = useTranslations("Projects");
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="pt-24 min-h-screen bg-background">
      {/* Hero Section */}
      <Section variant="full" className="pb-12 pt-16">
        <Container variant="default">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t("backToProjects")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <Badge key={t} variant="outline" className="px-3 py-1 text-xs uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                      {t}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-serif tracking-tighter text-foreground mb-8 leading-tight">
                  {project.title}
                </h1>
                
                <p className="text-xl text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
                  {project.longDescription}
                </p>

                <div className="flex flex-wrap gap-4">
                  {project.links.live && (
                    <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" /> {t("liveDemo")}
                      </a>
                    </Button>
                  )}
                  {project.links.github && (
                    <Button asChild variant="outline" size="lg" className="gap-2 bg-background/50 backdrop-blur-sm">
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" /> {t("sourceCode")}
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50"
            >
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                className="object-cover"
                priority
                unoptimized={true}
              />
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Gallery Section */}
      <Section variant="full" className="py-24 bg-muted/30">
        <Container variant="default">
          <div className="mb-12">
            <h2 className="text-2xl font-serif tracking-tight text-foreground">{t("projectGallery")}</h2>
            <div className="h-1 w-20 bg-primary/30 mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative aspect-video rounded-xl overflow-hidden border border-border/40 shadow-md group"
              >
                <Image
                  src={img}
                  alt={`${project.title} Screenshot ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized={true}
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
