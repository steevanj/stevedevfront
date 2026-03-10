// src/api/projects.ts
import apiClient from "./apiClient";

export interface ProjectPayload {
  title: string;
  slug: string;
  description: string;
  architecture_highlight?: string;
  github_url?: string;
  live_url?: string;
  api_doc_url?: string;
  status?: "production" | "in_progress" | "archived";
  featured?: boolean;
  technologies?: string[]; // UUIDs
}

export interface Technology {
  id: string;
  name: string;
  icon?: string;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  github_url?: string;
  live_url?: string;
  api_doc_url?: string;
  status: "production" | "in_progress" | "archived";
  featured: boolean;
  technologies: Technology[]; // normalized to objects
}

export const createProject = async (data: ProjectPayload) => {
  const response = await apiClient.post("/api/profile/projects/", data);
  return response.data;
};

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  const response = await apiClient.get("/api/profile/projects/");
  const projects = response.data;

  // Normalize technologies: if backend returns UUIDs, wrap them as objects
  return projects.map((project: any) => ({
    ...project,
    technologies: (project.technologies || []).map((tech: any) =>
      typeof tech === "string"
        ? { id: tech, name: tech } // fallback if only UUID string
        : tech
    ),
  }));
};
