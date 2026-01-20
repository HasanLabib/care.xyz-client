"use client"; // important

import api from "@/app/library/api";
import { createContext, useEffect, useState, useRef } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        // Use cookies for authentication (server automatically includes them)
        const res = await api.get("/me", {
          signal: abortControllerRef.current.signal
        });
        setUser(res.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch user:', error);
          setUser(null);
        }
      } finally {
        if (!abortControllerRef.current.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getUser();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout");
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Continue with client-side logout even if server logout fails
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
