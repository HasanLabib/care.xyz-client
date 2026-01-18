import axios from "axios";

const api = axios.create({
  baseURL: "https://server-psi-lake-59.vercel.app",
  withCredentials: true, 
});

if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default api;
