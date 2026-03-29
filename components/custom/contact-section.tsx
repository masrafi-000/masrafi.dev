"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, MapPin, Mail } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import gsap from "@/lib/gsap";
import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";

export const ContactSection = () => {
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <Section ref={sectionRef} variant="full" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <Container variant="default" className="relative z-10 w-full max-w-6xl mx-auto">
        
        <div className="text-center mb-16 relative z-10">
          <SectionHeading align="center">
            <h2 className="text-3xl md:text-5xl lg:text-5xl font-serif tracking-tight text-foreground mb-4">
              {t("pageTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("pageDescription")}
            </p>
          </SectionHeading>
        </div>

        <div 
          ref={cardRef} 
          className="relative z-10 bg-card border border-border shadow-sm rounded-3xl overflow-hidden flex flex-col lg:flex-row w-full opacity-0"
        >
          {/* Left Column: Contact Info */}
          <div className="lg:w-2/5 p-8 md:p-12 bg-muted/30 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif text-foreground mb-4">{t("getInTouch")}</h3>
              <p className="text-muted-foreground leading-relaxed mb-10 text-sm md:text-base">
                {t("getInTouchDesc")}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{t("contactInfo")}</p>
                    <p className="text-foreground text-sm">{t("locationText")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${t("emailText")}`} className="text-foreground text-sm hover:text-primary transition-colors">
                      {t("emailText")}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{t("socialLinks")}</p>
              <div className="flex gap-3">
                {[
                  { icon: Github, href: "https://github.com/masrafidev" },
                  { icon: Linkedin, href: "https://linkedin.com/in/masrafidev" },
                  { icon: Twitter, href: "https://twitter.com/masrafidev" }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-background border border-border rounded-full text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:w-3/5 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="section-name" className="text-sm font-medium">{t("nameLabel")}</Label>
                  <Input 
                    id="section-name" 
                    name="name" 
                    required 
                    placeholder={t("namePlaceholder")}
                    className="bg-background border-border focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="section-email" className="text-sm font-medium">{t("emailLabel")}</Label>
                  <Input 
                    id="section-email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder={t("emailPlaceholder")}
                    className="bg-background border-border focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="section-subject" className="text-sm font-medium">{t("subjectLabel")}</Label>
                <Input 
                  id="section-subject" 
                  name="subject" 
                  required 
                  placeholder={t("subjectPlaceholder")}
                  className="bg-background border-border focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-lg"
                />
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <Label htmlFor="section-message" className="text-sm font-medium">{t("messageLabel")}</Label>
                <Textarea 
                  id="section-message" 
                  name="message" 
                  required 
                  placeholder={t("messagePlaceholder")}
                  className="bg-background border-border focus-visible:ring-1 focus-visible:ring-primary min-h-[140px] flex-1 resize-none rounded-lg"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isSuccess}
                  className={cn(
                    "w-full sm:w-auto h-11 px-8 rounded-lg font-medium transition-all",
                    isSuccess ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""
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
                      {t("sendButton")}
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

      </Container>
    </Section>
  );
};
