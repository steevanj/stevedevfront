// src/api/skills.ts
import apiClient from "./apiClient";

export interface SkillPayload {
  name: string;        // e.g. "Python"
  category: string;    // e.g. "Backend", "Database", "Tools"
  icon?: string;       // optional icon class (e.g. "devicon-python-plain")
}

export interface SkillResponse {
  id: string;          // UUID
  name: string;
  category: string;
  icon?: string;
}

// Create a new skill
export const createSkill = async (data: SkillPayload): Promise<SkillResponse> => {
  const response = await apiClient.post("/api/skills/", data);
  return response.data;
};

// Fetch all skills
export const fetchSkills = async (): Promise<SkillResponse[]> => {
  const response = await apiClient.get("/api/skills/");
  const skills = response.data;

  // Normalize response shape
  if (Array.isArray(skills)) {
    return skills;
  }
  if (Array.isArray(skills.results)) {
    return skills.results;
  }
  if (Array.isArray(skills.data)) {
    return skills.data;
  }
  return [];
};

// Fetch a single skill by ID
export const fetchSkillById = async (id: string): Promise<SkillResponse> => {
  const response = await apiClient.get(`/api/skills/${id}/`);
  return response.data;
};

// Update a skill
export const updateSkill = async (id: string, data: SkillPayload): Promise<SkillResponse> => {
  const response = await apiClient.put(`/api/skills/${id}/`, data);
  return response.data;
};

// Delete a skill
export const deleteSkill = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/skills/${id}/`);
};
