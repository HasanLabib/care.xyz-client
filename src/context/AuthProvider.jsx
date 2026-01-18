"use client"; // important

import api from "@/app/library/api";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("accessToken"); // safe here
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const logout = async () => {
    localStorage.removeItem("accessToken"); // safe in client
    try {
      await api.post("/logout");
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
