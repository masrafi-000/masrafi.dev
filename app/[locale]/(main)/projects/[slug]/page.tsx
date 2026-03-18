import React from "react";
import projectsData from "@/data/projects.json";
import { notFound } from "next/navigation";
import ProjectDetailsClient from "../_components/ProjectDetailsClient";

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}
