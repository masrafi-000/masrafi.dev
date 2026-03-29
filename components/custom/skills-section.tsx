"use client";

import { useState, useRef, useEffect } from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Server, Wrench, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "@/lib/gsap";

export const SkillsSection = () => {
  const t = useTranslations("Skills");
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const skillCategories = [
    {
      id: "frontend",
      title: t("frontend"),
      icon: Code2,
      skills: t("frontendSkills").split(", "),
      color: "from-blue-500/10 to-transparent",
      accent: "text-blue-500",
    },
    {
      id: "backend",
      title: t("backend"),
      icon: Server,
      skills: t("backendSkills").split(", "),
      color: "from-emerald-500/10 to-transparent",
      accent: "text-emerald-500",
    },
    {
      id: "tools",
      title: t("tools"),
      icon: Wrench,
      skills: t("toolsSkills").split(", "),
      color: "from-purple-500/10 to-transparent",
      accent: "text-purple-500",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef} variant="full" className="py-24 md:py-32 bg-background overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px]  animate-pulse opacity-50" />
      </div>

      <Container variant="default" className="relative z-10 space-y-16 px-4 md:px-8">
        <div ref={headingRef} className="text-center">
          <SectionHeading align="center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tight text-foreground mb-4">
              {t("sectionTitle")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              {t("sectionSubtitle")}
            </p>
          </SectionHeading>
        </div>

        {/* The Expanding Panels Layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[800px] lg:h-[550px] w-full  mx-auto">
          {skillCategories.map((category, idx) => {
            const isActive = activeIndex === idx;
            const Icon = category.icon;

            return (
              <motion.div
                key={category.id}
                layout
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative  overflow-hidden cursor-pointer flex flex-col justify-end border transition-colors duration-500",
                  isActive 
                    ? "lg:flex-[2.5] flex-[2.5] border-primary/30 shadow-2xl shadow-primary/5 bg-background/60" 
                    : "lg:flex-1 flex-1 border-border/40 hover:border-primary/20 bg-muted/10",
                  "backdrop-blur-xl"
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              >
                {/* Background Gradient */}
                <div 
                  className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-50 transition-opacity duration-500 pointer-events-none", 
                    category.color, 
                    isActive ? "opacity-100" : "opacity-30 group-hover:opacity-50"
                  )} 
                />
                
                {/* Watermark Icon */}
                <Icon 
                  className={cn(
                    "absolute -bottom-10 -right-10 w-72 h-72 opacity-5 transition-all duration-1000 pointer-events-none", 
                    isActive ? "scale-110 rotate-12" : "scale-100 rotate-0 grayscale"
                  )} 
                />

                <div className="relative z-10 w-full h-full flex flex-col">
                  {/* Content when Active */}
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="active-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                        className="flex-1 flex flex-col p-6 lg:p-10"
                      >
                        <div className="flex items-center gap-5 mb-8">
                          <div className={cn("p-4 bg-background shadow-xs border border-border/50", category.accent)}>
                            <Icon className="w-8 h-8 lg:w-10 lg:h-10" />
                          </div>
                          <div>
                            <span className="text-xs lg:text-sm font-semibold uppercase tracking-widest text-muted-foreground/80 mb-1 block">Category</span>
                            <h3 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground">{category.title}</h3>
                          </div>
                        </div>

                        <div className="mt-auto">
                           <h4 className="text-xs lg:text-sm font-semibold text-foreground/60 uppercase tracking-widest mb-5">Core Technologies</h4>
                           <div className="flex flex-wrap gap-2 lg:gap-3">
                             {category.skills.map((skill, i) => (
                               <motion.span
                                 key={skill}
                                 initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                 animate={{ opacity: 1, scale: 1, y: 0 }}
                                 transition={{ duration: 0.3, delay: 0.2 + i * 0.04, ease: "backOut" }}
                                 className="px-4 py-2 lg:px-6 lg:py-3 bg-background border border-border/60 hover:border-primary/40  text-xs lg:text-sm font-medium text-foreground transition-all cursor-default shadow-xs hover:shadow-md"
                               >
                                 {skill}
                               </motion.span>
                             ))}
                           </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="inactive-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full w-full flex lg:flex-col items-center justify-between lg:justify-center p-6 gap-4"
                      >
                          <div className={cn("p-4 rounded-2xl bg-background border border-border/50 shrink-0 shadow-sm", category.accent)}>
                            <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
                          </div>
                          
                          {/* Desktop Vertical Text */}
                          <h3 
                            className="hidden lg:block text-2xl font-bold text-foreground/80 tracking-wide"
                            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                          >
                            {category.title}
                          </h3>

                          {/* Mobile Horizontal Text */}
                          <h3 className="lg:hidden text-xl font-bold text-foreground/80 tracking-tight">
                            {category.title}
                          </h3>

                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-border/60 flex items-center justify-center shrink-0 bg-background/50 hover:bg-background transition-colors">
                             <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground lg:rotate-90" />
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
