import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Always use Next.js API proxy for consistency
  withCredentials: true,
});

// Add response interceptor for error handling with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only handle 401 errors that are NOT from the /me endpoint and haven't been retried
    if (error.response?.status === 401 && 
        !originalRequest.url?.includes('/me') && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await api.post('/refresh-token');
        // Retry the original request
        return api.request(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
