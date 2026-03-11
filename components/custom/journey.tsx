"use client";

import Container from "@/components/custom/container";
import SectionHeading from "@/components/custom/sectionHeading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Journey = () => {
  const t = useTranslations("Journey");
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  const journeyItems = [
    {
      id: "01",
      year: t("year1Title"),
      desc: t("year1Desc"),
      className: "md:col-span-12 lg:col-span-7", 
    },
    {
      id: "02",
      year: t("year2Title"),
      desc: t("year2Desc"),
      className: "md:col-span-12 lg:col-span-5",
    },
    {
      id: "03",
      year: t("year3Title"),
      desc: t("year3Desc"),
      className: "md:col-span-12 lg:col-span-5",
    },
    {
      id: "04",
      year: t("year4Title"),
      desc: t("year4Desc"),
      className: "md:col-span-12 lg:col-span-7",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Heading block animation
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Bento grid cards staggered animation
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15, // Butter smooth stagger
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current[0], // Trigger when the first card in the grid enters
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-background py-24 md:py-32 overflow-hidden"
    >
      {/* Classic Architectural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-primary/10  blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-900/10  blur-[100px]" />
      </div>

      <Container variant="default" className="relative z-10 w-full">
        
        {/* Bordered Container mimicking the wireframe boundary */}
        <div className="  p-4 md:p-8 lg:p-10 bg-background/20 relative overflow-hidden">
          

          {/* Top Row: Full Width Heading Card */}
          <div 
            ref={headingRef} 
            className="w-full bg-background/60 backdrop-blur-xl  p-10 md:p-14 mb-6  text-center  hover:bg-background/80 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Glowing hover accent */}
            <div className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <SectionHeading align="center" className="mb-0 relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-serif tracking-tight text-foreground mb-4">
                {t("sectionTitle")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                {t("sectionSubtitle")}
              </p>
            </SectionHeading>
          </div>

          {/* Bottom Rows: Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {journeyItems.map((item) => (
              <div
                key={item.id}
                ref={addToRefs}
                className={`relative bg-background/60 backdrop-blur-xl border border-border/40 p-8 md:p-10 lg:p-12 hover:bg-background/90 hover:border-primary/50 transition-all duration-500 shadow-md hover:-translate-y-2 hover:shadow-2xl overflow-hidden  group flex flex-col justify-between ${item.className}`}
              >
                {/* Glowing hover accent */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

                {/* Huge Background Watermark / Phase Indicator */}
                <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 opacity-[0.03] group-hover:opacity-[0.06] text-8xl md:text-[12rem] lg:text-[14rem] leading-none font-serif font-bold pointer-events-none select-none text-foreground transition-all duration-700 transform group-hover:scale-110">
                  {item.year.replace(/[^0-9]/g, '').substring(0, 4) || item.id} 
                  {/* Extracting year numbers for a cool watermark effect, fallback to ID */}
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 md:mb-12">
                    <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-primary uppercase opacity-80 block">
                      Phase {item.id}
                    </span>
                    
                    {/* Decorative Arrow Icon */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 transform group-hover:rotate-45">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold text-foreground tracking-tighter mb-4 md:mb-6">
                      {item.year}
                    </h3>
                    
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
};
