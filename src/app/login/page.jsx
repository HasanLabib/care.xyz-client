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

  const handleLogin = async e => {
    e.preventDefault();
    const res = await api.post("/login", { email, password });
    const user = res.data?.user || res.data || null;
    if (user) {
      setUser(user);
    } else {
      try {
        const me = await api.get("/me");
        setUser(me.data);
      } catch {}
    }
    router.push("/services");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="card p-8 shadow w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        <input className="input input-bordered mb-3" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="input input-bordered mb-3" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
