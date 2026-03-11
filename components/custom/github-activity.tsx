"use client";

import Container from "@/components/custom/container";
import SectionHeading from "@/components/custom/sectionHeading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Button } from "../ui/button";
import Section from "./section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icons
const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const RepoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export const GitHubActivity = () => {
  const t = useTranslations("GitHub");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();

  // Fetch data with TanStack Query and Axios
  const { data, isLoading, error } = useQuery({
    queryKey: ["githubActivity", locale],
    queryFn: async () => {
      const { data } = await axios.get(`/${locale}/api/v0/github`);
      return data;
    },
    staleTime: 60 * 1000 * 60, // 1 hour cache on the client side
  });

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Handle GSAP animations
  useEffect(() => {
    if (!sectionRef.current || cardsRef.current.length === 0 || isLoading) return;

    let ctx: gsap.Context;

    // Small delay to ensure the browser has laid out the newly rendered elements
    // so ScrollTrigger can accurately measure their positions.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      ctx = gsap.context(() => {
        // Add a clean stagger animation to all cards simultaneously
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            willChange: "transform, opacity",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, sectionRef);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [isLoading, data]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const isDark = resolvedTheme === "dark";

  return (
    <Section ref={sectionRef} padding="default" className="relative bg-background overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px]" />
      </div>

      <Container variant="default"  className="relative z-10 px-4">
        <SectionHeading align="center" className="mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-foreground mb-4">
            {t("sectionTitle")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            {t("sectionSubtitle")}
          </p>
        </SectionHeading>

        {error && (
          <div className="text-center text-destructive p-4 bg-destructive/10 rounded-sm">
            Failed to load GitHub activity. Please try again later.
          </div>
        )}

        {isLoading || !data ? (
          /* Detailed Loading Skeletons matching the Bento Grid structure */
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card Skeleton */}
              <Card className="bg-background/60 backdrop-blur-xl border-border/40  shadow-sm lg:col-span-1 flex flex-col items-center text-center p-0 gap-0">
                <div className="flex flex-col items-center text-center pb-2 pt-8 px-6 w-full">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-8 w-3/4 mb-2 rounded-sm" />
                  <Skeleton className="h-4 w-5/6 mb-1 rounded-sm" />
                  <Skeleton className="h-4 w-4/6 rounded-sm" />
                </div>
                <CardContent className="flex flex-col items-center justify-center grow pt-6 w-full">
                  <div className="flex gap-4 w-full justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-8 w-12 rounded-sm" />
                      <Skeleton className="h-3 w-20 rounded-sm" />
                    </div>
                    <div className="w-px bg-border/50 h-full min-h-[40px]" />
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-8 w-12 rounded-sm" />
                      <Skeleton className="h-3 w-20 rounded-sm" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pb-8 pt-4 w-full">
                  <Skeleton className="w-full h-12 rounded-xl" />
                </CardFooter>
              </Card>

              {/* Contribution Graph Skeleton */}
              <Card className="bg-background/60 backdrop-blur-xl border-border/40 shadow-sm lg:col-span-2 flex flex-col justify-center overflow-hidden p-0 gap-0">
                <CardHeader className="flex flex-row items-center gap-3 pb-6 pt-8 px-8 w-full">
                  <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                  <Skeleton className="h-8 w-40 rounded-sm" />
                </CardHeader>
                <CardContent className="px-8 pb-8 overflow-hidden w-full h-[200px] flex items-center justify-center">
                  <Skeleton className="w-full h-full rounded-xl" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Repositories Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full bg-background/60 backdrop-blur-xl border-border/40 shadow-sm flex flex-col relative overflow-hidden group/card p-0 gap-0">
                  <CardHeader className="flex flex-row justify-between items-start pt-6 px-6 pb-2 gap-2 relative z-10 w-full space-y-0">
                    <div className="flex items-center gap-2 w-full">
                      <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                      <Skeleton className="h-6 w-3/4 rounded-sm" />
                    </div>
                    <Skeleton className="w-12 h-6 rounded-full shrink-0" />
                  </CardHeader>
                  <CardContent className="px-6 py-2 grow flex flex-col relative z-10 gap-2">
                    <Skeleton className="h-4 w-full rounded-sm" />
                    <Skeleton className="h-4 w-5/6 rounded-sm" />
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-2 flex justify-between items-center mt-auto w-full">
                    <Skeleton className="h-4 w-1/3 rounded-sm" />
                    <Skeleton className="h-4 w-1/4 rounded-sm" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Top Row: User Stats and Contribution Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left: Profile Card */}
              <Card 
                ref={addToRefs}
                className="bg-background/60 backdrop-blur-xl border-border/40 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 lg:col-span-1 flex flex-col items-center text-center group overflow-hidden p-0 gap-0"
              >
                <div className="flex flex-col items-center text-center pb-2 pt-8 px-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg mb-4 group-hover:scale-105 transition-transform duration-500 shrink-0">
                   
                    <Image src={data.user.avatar_url} alt={data.user.login} width={100} height={100} className="w-full h-full object-cover" />
                  </div>
                  <CardTitle className="text-2xl font-bold font-serif text-foreground mb-2">
                    {data.user.login}
                  </CardTitle>
                  <CardDescription className="max-w-xs leading-relaxed text-sm">
                    {data.user.bio}
                  </CardDescription>
                </div>
                
                <CardContent className="flex flex-col items-center justify-center grow pt-6">
                  <div className="flex gap-4 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-foreground">{data.user.public_repos}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("publicRepos")}</span>
                    </div>
                    <div className="w-px bg-border/50 h-full min-h-[40px]" />
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-foreground">{data.user.followers}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("followers")}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pb-8 pt-4">
                  <Link href={data.user.html_url} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full py-3 px-6 bg-primary text-center text-primary-foreground font-medium  hover:opacity-90 transition-opacity">
                      {t("viewProfile")}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Right: Contribution Graph built natively bypassing iframe */}
              <Card 
                ref={addToRefs}
                className="bg-background/60 backdrop-blur-xl border-border/40  shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 lg:col-span-2 flex flex-col justify-center overflow-hidden p-0 gap-0"
              >
                <CardHeader className="flex flex-row items-center gap-3 pb-6 pt-8 px-8">
                  <RepoIcon className="w-6 h-6 text-primary shrink-0" />
                  <CardTitle className="text-2xl font-bold font-serif text-foreground m-0">
                    {t("contributions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-8 pb-8 overflow-x-auto w-full">
                  {/* 
                    Using react-github-calendar explicitly with the masrafi-000 username 
                    It handles rendering the beautiful SVG grids dynamically 
                  */}
                  <div className="w-full min-w-[700px] flex justify-center lg:justify-start">
                    <GitHubCalendar 
                      username="masrafi-000" 
                      colorScheme={isDark ? "dark" : "light"}
                      fontSize={12}
                      blockSize={12}
                      blockMargin={4}
                      theme={{
                        dark: ['#1e1e2d', '#392E5C', '#553784', '#7843b0', '#9b5de5'],
                        light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row: Recent Repositories Grid */}
            <div>
              <h3 className="text-2xl font-bold font-serif mb-6 mt-8 text-foreground ml-2">
                {t("recentRepos")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.repos.map((repo: { id: number, name: string, description: string, html_url: string, stargazers_count: number, language: string, updated_at: string }) => (
                  <Link 
                    key={repo.id} 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block h-full group"
                  >
                    <Card 
                      ref={addToRefs}
                      className="h-full bg-background/60 backdrop-blur-xl border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 flex flex-col relative overflow-hidden group/card p-0 gap-0"
                    >
                      {/* Glow on hover */}
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />

                      <CardHeader className="flex flex-row justify-between items-start pt-6 px-6 pb-2 gap-2 relative z-10 w-full space-y-0">
                        <div className="flex items-center gap-2 text-primary overflow-hidden min-w-0">
                          <RepoIcon className="w-5 h-5 shrink-0" />
                          <CardTitle className="text-lg truncate" title={repo.name}>
                            {repo.name}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="flex gap-1 items-center rounded-full bg-background shrink-0 whitespace-nowrap">
                          <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {repo.stargazers_count}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent className="px-6 py-2 grow flex flex-col relative z-10">
                        <CardDescription className="line-clamp-2 text-sm">
                          {repo.description || "No description provided."}
                        </CardDescription>
                      </CardContent>

                      <CardFooter className="px-6 pb-6 pt-2 flex justify-between items-center text-xs text-muted-foreground relative z-10 mt-auto w-full">
                        <div className="flex items-center gap-1.5 align-middle w-1/2 overflow-hidden truncate">
                          {repo.language && (
                            <>
                              <span className="w-2.5 h-2.5 rounded-full bg-primary/80 shrink-0" />
                              <span className="truncate">{repo.language}</span>
                            </>
                          )}
                        </div>
                        <span className="shrink-0">{t("updatedAuth")} {new Date(repo.updated_at).toLocaleDateString(locale)}</span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};
