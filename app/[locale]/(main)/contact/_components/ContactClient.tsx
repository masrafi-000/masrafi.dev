"use client";

import { GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/social-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, LucideIcon, Mail, Phone, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import Container from "@/components/custom/container";
import Section from "@/components/custom/section";
import SectionHeading from "@/components/custom/sectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import gsap from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ContactFormData, contactSchema } from "@/validators/zod/contact";



export default function ContactClient() {
  const t = useTranslations("Contact");
  const [isSuccess, setIsSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur"
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
	  // Animations for layout segments
      gsap.fromTo(
        ".hero-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".contact-boxes .box-anim",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".form-section",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.4 }
      );
      gsap.fromTo(
        ".social-section",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.4 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    console.log("Form Submitted with Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const socialLinks = [
    { icon: GithubIcon, href: 'https://github.com/masrafidev', label: 'GitHub' },
    { icon: TwitterIcon, href: 'https://twitter.com/masrafidev', label: 'Twitter' },
    { icon: LinkedinIcon, href: 'https://linkedin.com/in/masrafidev', label: 'LinkedIn' },
    { icon: InstagramIcon, href: 'https://instagram.com/masrafidev', label: 'Instagram' },
  ];

  return (
    <Section ref={containerRef} variant="full" className="min-h-screen relative overflow-hidden bg-background pt-8 pb-16">
      <Container variant="default" className="h-full lg:border-x border-border/50 relative">
        <div aria-hidden className="absolute inset-0 isolate -z-10 opacity-80 contain-strict pointer-events-none">
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
        </div>

        {/* Hero */}
        <div className="hero-section flex grow flex-col justify-center px-4 md:px-8 pt-32 pb-16">
          <SectionHeading align="left">
            <h1 className="text-4xl font-serif tracking-tight text-foreground md:text-5xl lg:text-5xl mb-4">
               {t("pageTitle")}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
               {t("pageDescription")}
            </p>
          </SectionHeading>
        </div>

        <BorderSeparator />

        {/* Contact Info Grid */}
        <div className="contact-boxes grid md:grid-cols-2">
          <Box className="box-anim" icon={Mail} title="Email" description="We respond to all emails within 24 hours.">
            <a href={`mailto:${t("emailText")}`} className="font-mono text-[15px] font-medium tracking-wide hover:underline hover:text-primary transition-colors">
              {t("emailText")}
            </a>
            <CopyButton className="size-8" test={t("emailText")} />
          </Box>
          <Box className="box-anim border-b-0 md:border-r-0" icon={Phone} title="Phone" description="We're available Mon-Fri, 9am-5pm.">
            <div className="w-full">
              <div className="flex items-center justify-between gap-x-2 mb-2 w-full">
                <a href={`tel:+923001234567`} className="block font-mono text-[15px] font-medium tracking-wide hover:underline hover:text-primary transition-colors">+92 300 1234567</a>
                <CopyButton className="size-8" test="+923001234567" />
              </div>
              <div className="flex items-center justify-between gap-x-2 w-full">
                <a href={`tel:+923219876543`} className="block font-mono text-[15px] font-medium tracking-wide hover:underline hover:text-primary transition-colors">+92 321 9876543</a>
                <CopyButton className="size-8" test="+923219876543" />
              </div>
            </div>
          </Box>
        </div>

        <BorderSeparator />

        {/* Lower Split Section: Form + Socials */}
        <div className="grid lg:grid-cols-2">
			{/* Left Column: Form */}
			<div className="form-section p-6 md:p-10 lg:p-14 lg:border-r border-border/50 bg-background/50 backdrop-blur-sm border-b lg:border-b-0">
				<h2 className="text-2xl font-serif text-foreground mb-8">Send a Message</h2>
				
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5">
					<div className="flex flex-col gap-5">
						<div className="space-y-2">
							<Label htmlFor="name" className={cn("text-sm font-medium", errors.name && "text-destructive")}>
								{t("nameLabel")}
							</Label>
							<Input 
								id="name" 
								{...register("name")}
								placeholder={t("namePlaceholder")}
								className={cn(
									"bg-background/80 border-border focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-lg transition-colors",
									errors.name && "border-destructive focus-visible:ring-destructive"
								)}
							/>
							{errors.name && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.name.message as string}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email" className={cn("text-sm font-medium", errors.email && "text-destructive")}>
								{t("emailLabel")}
							</Label>
							<Input 
								id="email" 
								type="email" 
								{...register("email")}
								placeholder={t("emailPlaceholder")}
								className={cn(
									"bg-background/80 border-border focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-lg transition-colors",
									errors.email && "border-destructive focus-visible:ring-destructive"
								)}
							/>
							{errors.email && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.email.message as string}</p>}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="subject" className={cn("text-sm font-medium", errors.subject && "text-destructive")}>
							{t("subjectLabel")}
						</Label>
						<Input 
							id="subject" 
							{...register("subject")}
							placeholder={t("subjectPlaceholder")}
							className={cn(
								"bg-background/80 border-border focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-lg transition-colors",
								errors.subject && "border-destructive focus-visible:ring-destructive"
							)}
						/>
						{errors.subject && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.subject.message as string}</p>}
					</div>

					<div className="space-y-2 flex-1 flex flex-col">
						<Label htmlFor="message" className={cn("text-sm font-medium", errors.message && "text-destructive")}>
							{t("messageLabel")}
						</Label>
						<Textarea 
							id="message" 
							{...register("message")}
							placeholder={t("messagePlaceholder")}
							className={cn(
								"bg-background/80 border-border focus-visible:ring-1 focus-visible:ring-primary min-h-[160px] flex-1 resize-none rounded-lg transition-colors",
								errors.message && "border-destructive focus-visible:ring-destructive"
							)}
						/>
						{errors.message && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.message.message as string}</p>}
					</div>

					<div className="pt-4">
						<Button 
							type="submit" 
							disabled={isSubmitting || isSuccess}
							className={cn(
								"w-full h-12 px-8 rounded-lg font-medium transition-all duration-300",
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

			{/* Right Column: Socials */}
			<div className="social-section relative flex h-full min-h-[380px] md:min-h-[480px] flex-col items-center justify-center p-8 overflow-hidden">
				<div
					className={cn(
						'z--10 absolute inset-0 size-full pointer-events-none',
						'bg-[radial-gradient(color-mix(in_oklab,var(--foreground)30%,transparent)_1px,transparent_1px)]',
						'bg-size-[32px_32px]',
						'mask-[radial-gradient(ellipse_at_center,var(--background)_30%,transparent)]',
					)}
				/>

				<div className="relative z-1 space-y-8 flex flex-col items-center text-center max-w-sm">
					<div className="space-y-3">
						<h2 className="text-3xl font-serif md:text-4xl text-foreground">
							Find us online
						</h2>
						<p className="text-muted-foreground text-sm">Follow our social media channels to stay up-to-date with the latest.</p>
					</div>
					
					<div className="flex flex-wrap items-center justify-center gap-4">
						{socialLinks.map((link) => (
							<a
								key={link.label}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-background/80 backdrop-blur-md hover:bg-accent flex items-center gap-x-2.5 rounded-full border border-border/60 px-5 py-2.5 transition-colors shadow-sm"
							>
								<link.icon className="size-4.5" />
								<span className="font-mono text-sm font-medium tracking-wide">
									{link.label}
								</span>
							</a>
						))}
					</div>
				</div>
			</div>
        </div>

      </Container>
    </Section>
  );
}

// Sub-components ported from contact-page.tsx
function BorderSeparator() {
  return <div className="absolute inset-x-0 h-px w-full border-b border-border/50" />;
}

type ContactBox = React.ComponentProps<'div'> & {
  icon: LucideIcon;
  title: string;
  description: string;
};

function Box({ title, description, className, children, ...props }: ContactBox) {
  return (
    <div className={cn('flex flex-col justify-between border-b border-border/50 md:border-r md:border-b-0 bg-background/30 backdrop-blur-sm', className)}>
      <div className="bg-muted/30 flex items-center gap-x-3 border-b border-border/50 p-5">
        <props.icon className="text-primary size-5" strokeWidth={1.5} />
        <h3 className="font-serif text-lg font-medium tracking-wide text-foreground">
          {title}
        </h3>
      </div>
      <div className="flex items-center justify-between gap-x-4 p-5 md:p-8 min-h-[140px]">
         {children}
      </div>
      <div className="border-t border-border/50 p-5 bg-background/50">
        <p className="text-muted-foreground text-[13px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

type CopyButtonProps = React.ComponentProps<typeof Button> & {
  test: string;
};

function CopyButton({ className, variant = 'ghost', size = 'icon', test, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(test);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn('relative disabled:opacity-100 hover:bg-accent text-muted-foreground hover:text-foreground shrink-0 rounded-md', className)}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      disabled={copied || props.disabled}
      {...props}
    >
      <div className={cn('absolute transition-all duration-300', copied ? 'scale-100 opacity-100' : 'scale-75 opacity-0')}>
        <Check className="size-4 stroke-emerald-500" aria-hidden="true" />
      </div>
      <div className={cn('absolute transition-all duration-300', copied ? 'scale-75 opacity-0' : 'scale-100 opacity-100')}>
        <Copy aria-hidden="true" className="size-4" />
      </div>
    </Button>
  );
}
