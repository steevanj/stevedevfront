// src/api/profiles.ts
import apiClient from "./apiClient";

export interface ProfilePayload {
  full_name: string;
  title: string;
  bio?: string;
  short_intro?: string;
  resume_url?: string;
  github_url?: string;
  linkedin_url?: string;
  skills?: string[]; // UUIDs
}

export const createProfile = async (data: ProfilePayload) => {
  const response = await apiClient.post("/api/profile/profiles/", data);
  return response.data;
};
