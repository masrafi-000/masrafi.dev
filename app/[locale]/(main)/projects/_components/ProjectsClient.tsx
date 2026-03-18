"use client";

import React, { useState, useMemo } from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

export default function ProjectsClient({ projectsData }: { projectsData: ProjectType[] }) {
  const t = useTranslations("Projects");
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTech, setActiveTech] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Derived Values
  const categories = useMemo(() => {
    const cats = new Set(projectsData.map(p => p.category));
    return ["All", ...Array.from(cats)].sort();
  }, [projectsData]);

  const technologies = useMemo(() => {
    const techs = new Set(projectsData.flatMap(p => p.tech));
    return ["All", ...Array.from(techs)].sort();
  }, [projectsData]);

  const filteredProjects = useMemo(() => {
    return projectsData
      .filter((p) => {
        const matchesSearch = 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesTech = activeTech === "All" || p.tech.includes(activeTech);
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

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveTech("All");
    setSortBy("newest");
  };

  return (
    <main className="pt-24 min-h-screen bg-background">
      <Section variant="full" className="py-20">
        <Container variant="default">
          <SectionHeading align="left" className="mb-12">
            <h1 className="text-5xl md:text-7xl font-serif tracking-tighter text-foreground mb-6">
              {t("all")} <span className="italic font-light text-primary">{t("projects")}</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl">
              {t("archiveDescription")}
            </p>
          </SectionHeading>

          {/* Filter Bar */}
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

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Tech Filter */}
                <Select value={activeTech} onValueChange={setActiveTech}>
                  <SelectTrigger className="h-11 min-w-[160px] bg-muted/30 border-border/50">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 opacity-50" />
                      <SelectValue placeholder={t("filterByTech")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {technologies.map(tech => (
                      <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort Order */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11 min-w-[160px] bg-muted/30 border-border/50">
                    <SelectValue placeholder={t("sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("newest")}</SelectItem>
                    <SelectItem value="oldest">{t("oldest")}</SelectItem>
                    <SelectItem value="nameAsc">{t("nameAsc")}</SelectItem>
                    <SelectItem value="nameDesc">{t("nameDesc")}</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || activeCategory !== "All" || activeTech !== "All") && (
                  <Button variant="ghost" onClick={clearFilters} className="h-11 gap-2 text-muted-foreground hover:text-primary">
                    <X className="h-4 w-4" /> {t("clearFilters")}
                  </Button>
                )}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full border text-sm font-medium transition-all shrink-0",
                    activeCategory === cat 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative flex flex-col bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 rounded-xl"
                >
                  <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10" />
                  
                  {/* Image Container */}
                  <div className="relative aspect-16/10 overflow-hidden bg-muted">
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={true}
                    />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border/50 font-mono text-[10px]">
                        {project.year}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold bg-primary/5 text-primary border-primary/20">
                        {project.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-light leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary gap-2">
                        {t("viewProject")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="flex gap-1">
                        {project.tech.slice(0, 2).map((tech) => (
                           <div key={tech} title={tech} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 text-muted-foreground mb-6">
                <Search className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-lg">{t("noResults")}</p>
              <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">
                {t("clearFilters")}
              </Button>
            </motion.div>
          )}
        </Container>
      </Section>
    </main>
  );
}
