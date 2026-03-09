import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://13.60.83.201:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;