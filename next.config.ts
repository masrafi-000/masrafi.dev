import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",

  images: {
    domains: [
      "avatars.githubusercontent.com",
      "github-readme-stats.vercel.app",
      "streak-stats.demolab.com",
      "github-readme-activity-graph.vercel.app"
    ],
  },
};

export default withNextIntl(nextConfig);
