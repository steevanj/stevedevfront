// src/api/experiences.ts
import apiClient from "./apiClient";

export interface ExperiencePayload {
  company: string;
  role: string;
  start_date: string; // YYYY-MM-DD
  profile: string; // UUID
  end_date?: string;
  description?: string;
}

export const createExperience = async (data: ExperiencePayload) => {
  const response = await apiClient.post("/api/profile/experiences/", data);
  return response.data;
};
