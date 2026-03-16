import { CaseStudy } from "@/components/custom/case-study";
import { CTA } from "@/components/custom/cta";
import { GitHubActivity } from "@/components/custom/github-activity";
import { Hero } from "@/components/custom/hero";
import { Journey } from "@/components/custom/journey";
import { ProjectsSection } from "@/components/custom/projects-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <Journey />
      <GitHubActivity />
      <ProjectsSection />
      <CaseStudy />
      <CTA />
    </main>
  );
}
