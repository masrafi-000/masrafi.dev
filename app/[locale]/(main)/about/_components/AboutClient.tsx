"use client";

import React from "react";
import Image from "next/image";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code2, Server, Palette, CheckCircle2, Terminal } from "lucide-react";

export default function AboutClient() {
  const t = useTranslations("About");
  const j = useTranslations("Journey");

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

  const timeline = [
    { year: j("year4Title"), desc: j("year4Desc") },
    { year: j("year3Title"), desc: j("year3Desc") },
    { year: j("year2Title"), desc: j("year2Desc") },
    { year: j("year1Title"), desc: j("year1Desc") },
  ];

  return (
    <>
      <Section variant="default" className="px-6 pt-32 pb-16">
        <Container variant="default">
          <SectionHeading align="left" className="mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tighter text-foreground mb-4 md:mb-6">
              {t("title")} <span className="italic font-light text-primary">{t("me")}</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl">
              {t("subtitle")}
            </p>
          </SectionHeading>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            
            {/* Bio Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 bg-card border border-border/50 rounded-3xl p-8 lg:p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-primary" />
                  {t("biographyTitle")}
                </h2>
                <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg">
                  <p>{t("biographyText1")}</p>
                  <p>{t("biographyText2")}</p>
                </div>
              </div>
            </motion.div>

            {/* Photo Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-1 bg-card border border-border/50 rounded-3xl p-4 relative overflow-hidden min-h-[300px]"
            >
               <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent opacity-50 z-0" />
               <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden mb-4 border border-border/50">
                   {/* Fallback image if photo isn't available */}
                  <div className="w-full h-full bg-muted flex items-center justify-center min-h-[300px]">
                    <span className="text-muted-foreground font-light italic">Insert Avatar/Photo</span>
                  </div>
               </div>
            </motion.div>

            {/* Philosophies Box */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="md:col-span-3 bg-muted/30 border border-border/50 rounded-3xl p-8 lg:p-12"
            >
              <h2 className="text-2xl font-semibold mb-8 text-center">{t("philosophyTitle")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {philosophies.map((p, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{p.title}</h3>
                      <p className="text-muted-foreground text-sm font-light">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tech Stack Box */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.3 }}
               className="md:col-span-3 bg-card border border-border/50 rounded-3xl p-8 lg:p-12"
            >
               <h2 className="text-2xl font-semibold mb-8">{t("techStackTitle")}</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {techCategories.map((category, idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="flex items-center gap-3">
                        {category.icon}
                        <h3 className="font-medium text-lg">{category.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-xs text-muted-foreground font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </motion.div>

          </div>

          {/* Timeline Section */}
          <SectionHeading align="left" className="mb-16">
             <h2 className="text-3xl sm:text-4xl font-serif tracking-tighter text-foreground mb-4">
              {j("sectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl">
              {j("sectionSubtitle")}
            </p>
          </SectionHeading>

          <div className="max-w-3xl border-l border-primary/20 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
            {timeline.map((item, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="relative"
               >
                 <div className="absolute w-4 h-4 rounded-full bg-primary -left-[41px] md:-left-[57px] top-1.5 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                 <h3 className="text-2xl font-bold text-foreground mb-3">{item.year}</h3>
                 <p className="text-muted-foreground font-light leading-relaxed text-lg">
                   {item.desc}
                 </p>
               </motion.div>
            ))}
          </div>

        </Container>
      </Section>
    </>
  );
}
