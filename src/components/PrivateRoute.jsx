"use client";


import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import { useContext, useEffect } from "react";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return user ? children : null;
}
