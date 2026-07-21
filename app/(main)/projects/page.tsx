import React from "react";
import projectsData from "@/data/projects.json";
import ProjectsClient from "./_components/ProjectsClient";

export default function ProjectsPage() {
  return <ProjectsClient projectsData={projectsData} />;
}
