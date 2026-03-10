// src/api/contactMessages.ts
import apiClient from "./apiClient";

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  is_resolved?: boolean;
}

export const createContactMessage = async (data: ContactMessagePayload) => {
  const response = await apiClient.post("/api/profile/contactmessages/", data);
  return response.data;
};
