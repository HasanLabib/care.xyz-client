"use client"; // important

import api from "@/app/library/api";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const getUser = async () => {
      try {
        // Use cookies for authentication (server automatically includes them)
        const res = await api.get("/me");
        
        if (isMounted && res.data && res.data._id) {
          setUser(res.data);
        } else if (isMounted) {
          setUser(null);
        }
      } catch (error) {
        // Expected 401/403 when not logged in - don't log these
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error('Failed to fetch user:', error);
        }
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUser();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  const logout = async () => {
    try {
      await api.post("/logout");
      // Only clear user state if server logout succeeds
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // If server logout fails, still clear local state but warn user
      setUser(null);
      console.warn('Server logout failed, but local session cleared');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
