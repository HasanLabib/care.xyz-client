"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../library/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post("/register", form);
      if (res.status === 201) {
        alert("Registration successful! Please log in.");
        router.push("/login");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="card p-8 shadow w-96 bg-white">
        <h2 className="text-2xl mb-4 font-bold">Register</h2>

        <input
          name="name"
          type="text"
          value={form.name || ""}
          className="input input-bordered mb-3 w-full"
          placeholder="Name"
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="email"
          type="email"
          value={form.email || ""}
          className="input input-bordered mb-3 w-full"
          placeholder="Email"
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="contact"
          type="tel"
          value={form.contact || ""}
          className="input input-bordered mb-3 w-full"
          placeholder="Contact"
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="nid"
          type="text"
          value={form.nid || ""}
          className="input input-bordered mb-3 w-full"
          placeholder="NID"
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          value={form.password || ""}
          className="input input-bordered mb-3 w-full"
          placeholder="Password"
          onChange={handleChange}
          required
          minLength="6"
          disabled={loading}
        />

        <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
