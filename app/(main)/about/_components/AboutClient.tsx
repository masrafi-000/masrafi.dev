"use client";

import React from "react";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import { Code2, Server, Palette, CheckCircle2, Terminal, User, BookOpen, Layers } from "lucide-react";

export default function AboutClient() {
  const t = useTranslations("About");

  const techCategories = [
    {
      title: t("frontend"),
      icon: <Code2 className="w-5 h-5 text-primary" />,
      skills: t("frontendSkills").split(", "),
    },
    {
      title: t("backend"),
      icon: <Server className="w-5 h-5 text-primary" />,
      skills: t("backendSkills").split(", "),
    },
    {
      title: t("design"),
      icon: <Palette className="w-5 h-5 text-primary" />,
      skills: t("designSkills").split(", "),
    },
  ];

  const philosophies = [
    { title: t("philosophy1Title"), desc: t("philosophy1Desc") },
    { title: t("philosophy2Title"), desc: t("philosophy2Desc") },
    { title: t("philosophy3Title"), desc: t("philosophy3Desc") },
  ];

  // Animation variants for buttery smooth stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
  };

  return (
    <Section variant="full" className="relative min-h-screen overflow-hidden bg-background pt-32 pb-16 px-6">
      {/* Modern Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 blur-[100px] rounded-full animate-pulse opacity-50 will-change-transform" />
        <div className="absolute bottom-[-10%] -right-[5%] w-[600px] h-[600px] bg-primary/5 dark:bg-primary/5 blur-[120px] rounded-full animate-pulse opacity-50 will-change-transform animation-delay-2000" />
      </div>

      <Container variant="default" className="z-10 relative">
        <SectionHeading align="left" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-foreground mb-4">
              {t("title")}{" "}
              <span className="italic font-light bg-linear-to-r from-primary via-primary/80 to-primary/50 text-transparent bg-clip-text pr-2 py-2 block sm:inline">
                {t("me")}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl">
              {t("subtitle")}
            </p>
          </motion.div>
        </SectionHeading>

        {/* Bento Grid layout matching the new premium aesthetic */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          
          {/* Main Biography Box */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 bg-background/30 backdrop-blur-md border border-border/40 shadow-sm  p-8 lg:p-10 relative overflow-hidden group hover:shadow-md transition-[box-shadow,border-color] duration-500 hover:border-primary/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5  blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10  bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <Terminal className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {t("biographyTitle")}
                </h2>
              </div>
              <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-base sm:text-lg flex-1">
                <p>{t("biographyText1")}</p>
                <p>{t("biographyText2")}</p>
              </div>
            </div>
          </motion.div>

          {/* Photo/Avatar Box */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 lg:col-span-1 bg-background/30 backdrop-blur-md border border-border/40 hover:border-primary/20 shadow-sm hover:shadow-md transition-[box-shadow,border-color] duration-500  p-2 relative overflow-hidden min-h-[300px] sm:min-h-[350px] group flex flex-col"
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50 z-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 w-full h-full  overflow-hidden flex-1 border border-border/20 bg-muted/20 flex flex-col items-center justify-center group-hover:border-primary/10 transition-colors duration-500">
              {/* Stylish Avatar Placeholder */}
              <div className="relative w-32 h-32 mb-6 pointer-events-none">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                <div className="relative w-full h-full rounded-full border-2 border-primary/20 bg-background flex items-center justify-center overflow-hidden">
                  <User className="w-12 h-12 text-primary/40 group-hover:text-primary transition-colors duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-0 w-full h-1/3 bg-linear-to-t from-primary/10 to-transparent" />
                </div>
              </div>
              <div className="text-center px-4">
                 <h3 className="text-lg font-medium text-foreground tracking-tight">S M Masrafi</h3>
                 <p className="text-sm text-primary/80 uppercase tracking-widest mt-1">Frontend Engineer</p>
              </div>
            </div>
          </motion.div>

          {/* Philosophies Box */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-3 lg:col-span-1 bg-background/30 backdrop-blur-md border border-border/40 hover:border-primary/20 shadow-sm hover:shadow-md transition-[box-shadow,border-color] duration-500  p-8 relative overflow-hidden group flex flex-col"
          >
             <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/5  blur-2xl transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
             <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
             
             <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:rotate-12 transition-transform duration-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("philosophyTitle")}</h2>
             </div>

             <div className="flex flex-col gap-6 relative z-10 flex-1 justify-center">
               {philosophies.map((p, i) => (
                 <div key={i} className="flex items-start gap-4 group/item">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex shrink-0 items-center justify-center text-primary border border-primary/20 group-hover/item:bg-primary group-hover/item:text-white transition-colors duration-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground group-hover/item:text-primary transition-colors duration-300">{p.title}</h3>
                      <p className="text-muted-foreground text-sm font-light mt-1">{p.desc}</p>
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>

          {/* Tech Stack Box */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-3 lg:col-span-4 bg-background/30 backdrop-blur-md border border-border/40 hover:border-primary/20 shadow-sm hover:shadow-md transition-[box-shadow,border-color] duration-500 p-8 lg:p-10 relative overflow-hidden group/stack"
          >
             <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5  blur-3xl transition-transform group-hover/stack:scale-110 duration-1000 origin-center pointer-events-none" />
             <div className="absolute inset-0 bg-linear-to-tl from-primary/5 to-transparent opacity-0 group-hover/stack:opacity-100 transition-opacity duration-700 pointer-events-none" />

             <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="flex items-center justify-center w-10 h-10  bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-500">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t("techStackTitle")}</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 w-full">
                {techCategories.map((category, idx) => (
                  <div key={idx} className="bg-muted/10  p-6 border border-border/30 hover:bg-muted/20 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                      <div className="p-2 bg-primary/10 shrink-0">
                         {category.icon}
                      </div>
                      <h3 className="font-medium text-lg text-foreground">{category.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-3.5 py-1.5 bg-background border border-border text-xs text-muted-foreground font-medium hover:border-primary/50 hover:text-primary transition-colors duration-300 cursor-default shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>

        </motion.div>
      </Container>
    </Section>
  );
}
