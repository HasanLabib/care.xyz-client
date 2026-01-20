"use client";

import { useRouter } from "next/navigation";
import api from "../library/api";
import { AuthContext } from "@/context/AuthProvider";
import { useContext, useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, loading } = useContext(AuthContext);
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/services");
    }
  }, [user, loading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      // Cookies are automatically set by the server
      // No need to manually store in localStorage

      if (res.data?.user) {
        setUser(res.data.user);
        // Redirect to items/lists page (which is /services)
        router.push("/services");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="card p-8 shadow w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="email"
          required
          placeholder="Email"
          className="input input-bordered mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loginLoading}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="input input-bordered mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loginLoading}
        />
        <button className="btn btn-primary w-full" disabled={loginLoading}>
          {loginLoading ? "Logging in..." : "Login"}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="link link-primary">
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
