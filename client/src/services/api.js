import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

// Auto-attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
export const uploadResume = (formData) =>
  api.post("/interview/upload", formData);
export const evaluateAnswer = (data) => api.post("/interview/evaluate", data);
