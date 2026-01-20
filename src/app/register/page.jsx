"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../library/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.contact?.trim()) {
      newErrors.contact = 'Contact is required';
    } else if (!/^\d{10,15}$/.test(form.contact.replace(/\D/g, ''))) {
      newErrors.contact = 'Contact must be a valid phone number';
    }

    if (!form.nid?.trim()) {
      newErrors.nid = 'NID is required';
    } else if (form.nid.trim().length < 5) {
      newErrors.nid = 'NID must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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

        <div className="mb-3">
          <input
            name="name"
            type="text"
            value={form.name || ""}
            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
            placeholder="Name"
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-3">
          <input
            name="email"
            type="email"
            value={form.email || ""}
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
            placeholder="Email"
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-3">
          <input
            name="contact"
            type="tel"
            value={form.contact || ""}
            className={`input input-bordered w-full ${errors.contact ? 'input-error' : ''}`}
            placeholder="Contact"
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
        </div>

        <div className="mb-3">
          <input
            name="nid"
            type="text"
            value={form.nid || ""}
            className={`input input-bordered w-full ${errors.nid ? 'input-error' : ''}`}
            placeholder="NID"
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.nid && <p className="text-red-500 text-sm mt-1">{errors.nid}</p>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            value={form.password || ""}
            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
            placeholder="Password (min 6 characters)"
            onChange={handleChange}
            required
            minLength="6"
            disabled={loading}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
