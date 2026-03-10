import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.stevedev.live",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;