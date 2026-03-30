"use client";

import Container from "@/components/custom/container";
import { Badge } from "@/components/ui/badge";
import { Github } from "@/components/ui/social-icons";
import { Link } from "@/i18n/navigation";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  Code2,
  Globe,
  Layers,
  Star,
  X
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useRef, useState } from "react";

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


function Lightbox({
  images,
  activeIndex,
  onClose,
}: {
  images: string[];
  activeIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(activeIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-999 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 text-sm font-mono">
        {current + 1} / {images.length}
      </div>

      {/* Image */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl w-full max-h-[80vh] mx-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt={`Gallery image ${current + 1}`}
          width={1200}
          height={700}
          className="w-full h-full object-cover"
          unoptimized
        />
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === current
                  ? "border-primary scale-110"
                  : "border-white/10 opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}


function SpecRow({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 py-4 border-b border-border/40 last:border-0 hover:bg-primary/3 -mx-4 px-4 rounded-xl transition-colors duration-200"
    >
      <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-0.5">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground truncate">
          {value}
        </span>
      </div>
    </motion.div>
  );
}


export default function ProjectDetailsClient({
  project,
}: {
  project: ProjectType;
}) {
  const t = useTranslations("Projects");
  const heroRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      {/* ── Immersive Parallax Hero ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative h-[75vh] min-h-[520px] w-full overflow-hidden flex items-end"
      >
        {/* Parallax image */}
        <motion.div
          style={{ y, opacity, scale }}
          className="absolute inset-0 z-0"
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

        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 z-10 bg-linear-to-r from-background/30 via-transparent to-transparent" />

        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-20 w-full pb-14 pt-28 md:pb-20">
          <Container variant="default">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors mb-10 group backdrop-blur-md bg-black/25 px-4 py-2 rounded-full border border-white/20 w-fit hover:bg-black/35"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                {t("backToProjects")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary border border-primary/40 text-primary-foreground text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                  <Layers className="w-3 h-3" />
                  {project.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-gray-800 dark:text-white/80 text-xs font-mono tracking-widest backdrop-blur-md">
                  <CalendarDays className="w-3 h-3" />
                  {project.year}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-500/30 text-black dark:text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-serif tracking-tighter text-secondary-foreground dark:text-white drop-shadow-2xl leading-[1.05] mb-4 max-w-4xl">
                {project.title}
              </h1>

              {/* Short description */}
              <p className="text-foreground dark:text-white/85 text-lg max-w-2xl font-light leading-relaxed">
                {project.description}
              </p>
            </motion.div>
          </Container>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <Container variant="default" className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* ── Left: Main Content ──────────────────────────────────────────── */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-20">

            {/* About section */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-8 rounded-full bg-primary" />
                <h2 className="text-2xl font-serif tracking-tight text-foreground">
                  {t("aboutProject")}
                </h2>
              </div>

              <p className="text-lg md:text-xl leading-[1.9] text-foreground font-light">
                {project.longDescription}
              </p>
            </motion.section>

            {/* ── Gallery ──────────────────────────────────────────────────── */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Section heading */}
                <div className="flex items-center gap-5 mb-10">
                  <div className="h-px bg-linear-to-r from-border to-transparent flex-1" />
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {t("projectGallery")}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="h-px bg-linear-to-l from-border to-transparent flex-1" />
                </div>

                {/* Masonry-style grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {project.gallery.map((img, i) => {
                    const isFirst =
                      i === 0 && project.gallery.length % 2 !== 0;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          delay: i * 0.12,
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`group relative overflow-hidden rounded-2xl border border-border/50 shadow-xl cursor-pointer
                          ${isFirst ? "md:col-span-2 aspect-21/9" : "aspect-video"}
                        `}
                        onClick={() => setLightboxIndex(i)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Image
                          src={img}
                          alt={`${project.title} — Gallery ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          unoptimized={true}
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                        {/* View label */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <ArrowUpRight className="w-4 h-4" />
                            View Full
                          </div>
                        </div>

                        {/* Corner index tag */}
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white/60 text-[10px] font-mono border border-white/10">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </div>

          {/* ── Right: Sticky Sidebar ───────────────────────────────────────── */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-28 space-y-4"
            >
              {/* ── CTA Buttons ──────────────────────────────────────────────── */}
              <div className="flex flex-col gap-3">
                {project.links.live && (
                  <motion.a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 overflow-hidden transition-shadow hover:shadow-xl hover:shadow-primary/30"
                  >
                    <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <Globe className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{t("liveDemo")}</span>
                    <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.a>
                )}

                {project.links.github && (
                  <motion.a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl border border-border bg-muted/30 backdrop-blur-sm text-foreground font-semibold text-sm hover:bg-muted hover:border-border/80 transition-all duration-200"
                  >
                    <Github className="w-4 h-4" />
                    <span>{t("sourceCode")}</span>
                  </motion.a>
                )}
              </div>

              {/* ── Specification Card ───────────────────────────────────────── */}
              <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
                    project.config
                  </span>
                </div>

                {/* Specs */}
                <div className="px-5 py-2">
                  <SpecRow
                    icon={<Layers className="w-4 h-4" />}
                    label="Category"
                    value={project.category}
                    delay={0.35}
                  />
                  <SpecRow
                    icon={<CalendarDays className="w-4 h-4" />}
                    label="Year"
                    value={project.year}
                    delay={0.42}
                  />
                  {project.featured && (
                    <SpecRow
                      icon={<Star className="w-4 h-4 fill-current text-amber-400" />}
                      label="Status"
                      value={
                        <span className="text-amber-500 font-semibold">
                          Featured Project
                        </span>
                      }
                      delay={0.49}
                    />
                  )}
                </div>
              </div>

              {/* ── Tech Stack Card ──────────────────────────────────────────── */}
              <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
                    {t("techStack")}
                  </span>
                </div>

                {/* Tech pills */}
                <div className="px-5 py-5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="flex flex-wrap gap-2"
                  >
                    {project.tech.map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.6 + i * 0.06,
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-muted/60 border border-border/60 hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-foreground font-mono text-[11px] px-3 py-1.5 transition-all duration-200 cursor-default"
                        >
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </Container>

      {/* ── Lightbox ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={project.gallery}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
