"use client";

import React, { useRef } from "react";
import Container from "@/components/custom/container";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ChevronLeft, CalendarIcon, LayoutIcon, CodeIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";

interface ProjectType {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  description: string;
  longDescription: string;
  tech: string[];
  imageSrc: string;
  featured: boolean;
  links: {
    live?: string;
    github?: string;
  };
  gallery: string[];
}

export default function ProjectDetailsClient({ project }: { project: ProjectType }) {
  const t = useTranslations("Projects");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      {/* Immersive Hero Section */}
      <div ref={heroRef} className="relative h-[70vh] min-h-[500px] w-full overflow-hidden flex items-end">
        <motion.div 
          style={{ y, opacity }} 
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src={project.imageSrc}
            alt={project.title}
            fill
            className="object-cover"
            priority
            unoptimized={true}
          />
        </motion.div>
        
        <div className="relative z-20 w-full pb-12 pt-24 md:pb-16 md:pt-32 bg-linear-to-t from-background via-background/80 to-transparent">
          <Container variant="default">
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors mb-8 group backdrop-blur-md bg-background/20 px-4 py-2 rounded-full border border-white/10 w-fit"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {t("backToProjects")}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-widest bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-md">
                  {project.category}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-xs font-mono tracking-widest bg-background/40 text-foreground border-white/10 backdrop-blur-md">
                  {project.year}
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter text-foreground mb-4 md:mb-6 leading-[1.1]">
                {project.title}
              </h1>
            </motion.div>
          </Container>
        </div>
      </div>

      <Container variant="default" className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif tracking-tight mb-8 hidden lg:block">{t("aboutProject")}</h2>
              <div className="prose prose-lg prose-invert max-w-none text-muted-foreground font-light leading-relaxed mb-16">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground/90">
                  {project.longDescription}
                </p>
              </div>

              {/* Gallery Grid */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-12">
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-border flex-1" />
                    <h3 className="text-xl font-serif tracking-widest uppercase text-muted-foreground">{t("projectGallery")}</h3>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.gallery.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={`relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl group ${i === 0 && project.gallery.length % 2 !== 0 ? 'md:col-span-2 aspect-21/9' : 'aspect-video'}`}
                      >
                        <Image
                          src={img}
                          alt={`${project.title} Gallery ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sticky Sidebar (Right) */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-32 p-6 md:p-8 flex flex-col gap-6 md:gap-8 rounded-3xl bg-muted/20 border border-white/5 backdrop-blur-xl shadow-2xl"
            >
              {/* Project Details List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-border/50 pb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <LayoutIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Category</p>
                    <p className="font-medium text-foreground">{project.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 border-b border-border/50 pb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Year</p>
                    <p className="font-medium text-foreground">{project.year}</p>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CodeIcon className="w-5 h-5 text-primary" />
                  <h4 className="text-sm uppercase tracking-wider font-semibold text-foreground">{t("techStack")}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <Badge key={t} variant="secondary" className="bg-background border-white/5 hover:bg-muted text-foreground/80 font-medium px-3 py-1.5 transition-colors">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col gap-4">
                {project.links.live && (
                  <Button asChild size="lg" className="w-full gap-2 shadow-lg shadow-primary/20 group relative overflow-hidden">
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                      <span className="relative z-10 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> {t("liveDemo")}
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    </a>
                  </Button>
                )}
                {project.links.github && (
                  <Button asChild variant="outline" size="lg" className="w-full gap-2 bg-background/50 backdrop-blur-sm hover:bg-muted transition-all duration-300">
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" /> {t("sourceCode")}
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
          
        </div>
      </Container>
    </main>
  );
}
