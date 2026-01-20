"use client";

import { useRouter } from "next/navigation";
import api from "../library/api";
import { AuthContext } from "@/context/AuthProvider";
import { useContext, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("accessToken", res.data.accessToken);

      if (res.data?.user) setUser(res.data.user);

      router.push("/services");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="card p-8 shadow w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="email"
          required
          placeholder="Email"
          className="input input-bordered mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="input input-bordered mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
