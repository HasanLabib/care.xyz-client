import axios from "axios";

const api = axios.create({
  baseURL: "https://server-psi-lake-59.vercel.app", // direct backend
  withCredentials: true, // send cookies automatically
});

export default api;
