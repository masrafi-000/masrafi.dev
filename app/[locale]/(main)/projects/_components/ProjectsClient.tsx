"use client";

import React, { useState, useMemo } from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  Search,
  Filter,
  X,
  ExternalLink,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import WheelPagination from "@/components/wheel-pagination";
import { Github } from "@/components/ui/social-icons";

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

// ─── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: ProjectType;
  index: number;
}) {
  const t = useTranslations("Projects");
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col bg-card border border-border/60 overflow-hidden  shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-500"
    >
      {/* ── Image Zone ───────────────────────────────────── */}
      <div className="relative aspect-16/10 overflow-hidden bg-muted">
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={project.imageSrc}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized={true}
          />
        </motion.div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Year badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-background/70 backdrop-blur-md text-foreground border-border/50 font-mono text-[10px] px-2.5 py-1">
            {project.year}
          </Badge>
        </div>

        {/* Featured indicator */}
        {project.featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1  bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-semibold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
              Featured
            </span>
          </div>
        )}

        {/* ── Hover Action Buttons (slide up from bottom) ─── */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={hovered ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-3 p-4 bg-linear-to-t from-card/95 to-card/40 backdrop-blur-sm"
        >
          {/* Source Code button */}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5  border border-border bg-background/80 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-muted hover:border-primary/50 hover:text-primary transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
          )}

          {/* Live Link button */}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5  bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-200 active:scale-95 shadow-md shadow-primary/25"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
        </motion.div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category + tech tags row */}
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-widest font-bold bg-primary/5 text-primary border-primary/20 px-2.5 py-1"
          >
            {project.category}
          </Badge>

          {/* Mini tech pills */}
          <div className="flex gap-1.5 flex-wrap justify-end">
            {project.tech.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5  bg-muted text-muted-foreground font-mono"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 2 && (
              <span className="text-[10px] px-2 py-0.5  bg-muted text-muted-foreground font-mono">
                +{project.tech.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 font-light leading-relaxed flex-1">
          {project.description}
        </p>

        {/* ── Bottom Action Row ─────────────────────────────── */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border/50">
          {/* View details link */}
          <Link
            href={`/projects/${project.slug}`}
            className="group/link flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {t("viewProject")}7,524 kB 
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </Link>

          {/* Inline small action buttons (always visible) */}
          {/* <div className="flex items-center gap-2">
            {project.links.github && (
              <Link
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                title="Source Code"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted transition-all duration-200 active:scale-95"
              >
                <Github className="w-3.5 h-3.5" />
              </Link>
            )}
            {project.links.live && (
              <Link
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                title="Live Demo"
                onClick={(e) => e.stopPropagation()}
                className="p-2  bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div> */}

          <div className="flex gap-2 justify-between items-center">
            <div className="p-1.5 bg-green-600"></div>
            <div className="p-1.5 bg-red-600"></div>
            <div className="p-1.5 bg-blue-600"></div>
            <div className="p-1.5 bg-yellow-600"></div>
            <div className="p-1.5 bg-purple-600"></div>
          </div>
        </div>
      </div>

      {/* Subtle glow ring on hover */}
      <motion.div
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0  ring-1 ring-primary/30"
      />
    </motion.div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────────────────
export default function ProjectsClient({
  projectsData,
}: {
  projectsData: ProjectType[];
}) {
  const t = useTranslations("Projects");
  const ITEMS_PER_PAGE = 6;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTech, setActiveTech] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(0);

  const categories = useMemo(() => {
    const cats = new Set(projectsData.map((p) => p.category));
    return ["All", ...Array.from(cats)].sort();
  }, [projectsData]);

  const technologies = useMemo(() => {
    const techs = new Set(projectsData.flatMap((p) => p.tech));
    return ["All", ...Array.from(techs)].sort();
  }, [projectsData]);

  const filteredProjects = useMemo(() => {
    return projectsData
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          activeCategory === "All" || p.category === activeCategory;
        const matchesTech =
          activeTech === "All" || p.tech.includes(activeTech);
        return matchesSearch && matchesCategory && matchesTech;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.year - a.year;
        if (sortBy === "oldest") return a.year - b.year;
        if (sortBy === "nameAsc") return a.title.localeCompare(b.title);
        if (sortBy === "nameDesc") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [searchQuery, activeCategory, activeTech, sortBy, projectsData]);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, activeCategory, activeTech, sortBy]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveTech("All");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery || activeCategory !== "All" || activeTech !== "All";

  return (
    <Section variant="default" className="px-6 pt-32">
      <Container variant="default">
        {/* ── Page Header ──────────────────────────────────── */}
        <SectionHeading align="left" className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tighter text-foreground mb-4 md:mb-6">
            {t("all")}{" "}
            <span className="italic font-light text-primary">
              {t("projects")}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl">
            {t("archiveDescription")}
          </p>
        </SectionHeading>

        {/* ── Filter Bar ────────────────────────────────────── */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-muted/30 border-border/50 focus-visible:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Tech Filter */}
              <Select value={activeTech} onValueChange={setActiveTech}>
                <SelectTrigger className="h-11 w-full sm:min-w-[180px] bg-muted/30 border-border/50">
                  <Filter className="h-3.5 w-3.5 opacity-50 shrink-0" />
                  <SelectValue placeholder={t("filterByTech")} />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="max-h-60 overflow-y-auto [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden"
                >
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-full sm:min-w-[180px] bg-muted/30 border-border/50">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-60 overflow-y-auto [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden">
                  <SelectItem value="newest">{t("newest")}</SelectItem>
                  <SelectItem value="oldest">{t("oldest")}</SelectItem>
                  <SelectItem value="nameAsc">{t("nameAsc")}</SelectItem>
                  <SelectItem value="nameDesc">{t("nameDesc")}</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-11 gap-2 text-muted-foreground hover:text-primary w-full sm:w-auto"
                >
                  <X className="h-4 w-4" /> {t("clearFilters")}
                </Button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 shrink-0 relative",
                  activeCategory === cat
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"
                )}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full bg-primary -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Project Grid ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {paginatedProjects.length > 0 ? (
            <motion.div
              key={`${currentPage}-${searchQuery}-${activeCategory}-${activeTech}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/40 text-muted-foreground mb-6">
                <Search className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-lg mb-4">
                {t("noResults")}
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                {t("clearFilters")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex justify-center"
          >
            <WheelPagination
              totalPages={totalPages}
              visibleCount={5}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
            />
          </motion.div>
        )}
      </Container>
    </Section>
  );
}
