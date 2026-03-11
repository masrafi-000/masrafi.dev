import { CaseStudy } from "@/components/custom/case-study";
import { CTA } from "@/components/custom/cta";
import { GitHubActivity } from "@/components/custom/github-activity";
import { Hero } from "@/components/custom/hero";
import { Journey } from "@/components/custom/journey";

export default function Home() {
  return (
    <main>
      <Hero />
      <Journey />
      <GitHubActivity />
      <CaseStudy />
      <CTA />
    </main>
  );
}
