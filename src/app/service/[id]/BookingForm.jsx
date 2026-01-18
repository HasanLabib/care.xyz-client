"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/library/api";

export default function BookingForm({ service }) {
  const [form, setForm] = useState({ duration: "", location: "", address: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalCost = service.price * Number(form.duration || 1);

      await api.post("/booking", {
        serviceId: service._id,
        serviceName: service.name,
        duration: form.duration,
        location: form.location,
        address: form.address,
        totalCost,
      });

      alert("Booking placed successfully!");
      router.push("/my-bookings");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleBooking}
      className="card p-6 shadow-lg space-y-4 bg-base-100"
    >
      <h2 className="text-2xl font-semibold mb-2">Book This Service</h2>

      <input
        type="number"
        name="duration"
        min="1"
        value={form.duration}
        onChange={handleChange}
        placeholder="Duration (days)"
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="input input-bordered w-full"
        required
      />

      <button
        type="submit"
        className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
}
