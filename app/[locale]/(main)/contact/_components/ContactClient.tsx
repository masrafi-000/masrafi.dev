"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, MapPin, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import gsap from "@/lib/gsap";

export default function ContactClient() {
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        rightColRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for now (can be wired up to Formspree, Resend, or standard backend)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000); // Reset success state after 5s
  };

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-32 md:py-40 relative w-full max-w-7xl">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full animate-pulse opacity-50" />
      </div>

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-foreground mb-4">
          {t("pageTitle")}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
          {t("pageDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
        {/* Left Column: Contact Info */}
        <div ref={leftColRef} className="lg:col-span-2 space-y-8">
          <div className="bg-muted/10 backdrop-blur-xl border border-border/40 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t("getInTouch")}</h2>
            <p className="text-muted-foreground/80 leading-relaxed mb-8">
              {t("getInTouchDesc")}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/80 mb-1">{t("contactInfo")}</p>
                  <p className="text-foreground font-medium">{t("locationText")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/80 mb-1">Email</p>
                  <a href={`mailto:${t("emailText")}`} className="text-foreground font-medium hover:text-primary transition-colors">
                    {t("emailText")}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/80 mb-4">{t("socialLinks")}</p>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: "https://github.com" },
                  { icon: Linkedin, href: "https://linkedin.com" },
                  { icon: Twitter, href: "https://twitter.com" }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div ref={rightColRef} className="lg:col-span-3">
          <form 
            onSubmit={handleSubmit}
            className="bg-muted/10 backdrop-blur-xl border border-border/40 rounded-3xl p-8 h-full flex flex-col space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground/80 pl-1">{t("nameLabel")}</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  placeholder={t("namePlaceholder")}
                  className="bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80 pl-1">{t("emailLabel")}</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder={t("emailPlaceholder")}
                  className="bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-foreground/80 pl-1">{t("subjectLabel")}</Label>
              <Input 
                id="subject" 
                name="subject" 
                required 
                placeholder={t("subjectPlaceholder")}
                className="bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <Label htmlFor="message" className="text-sm font-medium text-foreground/80 pl-1">{t("messageLabel")}</Label>
              <Textarea 
                id="message" 
                name="message" 
                required 
                placeholder={t("messagePlaceholder")}
                className="bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm min-h-[160px] flex-1 resize-none rounded-xl"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                className={cn(
                  "w-full md:w-auto h-12 px-8 rounded-xl font-semibold tracking-wide transition-all shadow-md",
                  isSuccess ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : ""
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("sendingText")}
                  </>
                ) : isSuccess ? (
                  t("successMessage")
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t("sendButton")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
