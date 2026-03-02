// src/api/education.ts
import apiClient from "./apiClient";

export interface EducationPayload {
  institution: string;
  start_date: string; // YYYY-MM-DD
  profile: string; // UUID
  degree?: string;
  field_of_study?: string;
  end_date?: string;
  description?: string;
}

export const createEducation = async (data: EducationPayload) => {
  const response = await apiClient.post("/api/profiles/education/", data);
  return response.data;
};
