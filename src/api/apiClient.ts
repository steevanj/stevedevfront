import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.PROD
    ? "" // On Vercel use same domain
    : "http://13.60.83.201:8000", // Local development
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;