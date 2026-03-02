import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://happy145.pythonanywhere.com", // deployed backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
