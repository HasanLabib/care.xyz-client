import axios from "axios";

const api = axios.create({
  baseURL: "https://server-psi-lake-59.vercel.app", 
  withCredentials: true, 
});

export default api;
