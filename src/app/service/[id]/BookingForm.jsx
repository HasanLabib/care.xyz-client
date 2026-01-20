"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import api from "@/app/library/api";

export default function BookingForm({ service }) {
  const [form, setForm] = useState({ duration: "", location: "", address: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to book a service.");
      router.push("/login");
      return;
    }

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

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <div className="card p-6 shadow-lg bg-base-100">
        <h2 className="text-2xl font-semibold mb-4">Book This Service</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Please log in to book this service
          </p>
          <div className="space-x-4">
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
            <Link href="/register" className="btn btn-outline">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleBooking}
      className="card p-6 shadow-lg space-y-4 bg-base-100"
    >
      <h2 className="text-2xl font-semibold mb-2">Book This Service</h2>

      <div>
        <label className="label">
          <span className="label-text">Duration (days)</span>
        </label>
        <input
          type="number"
          name="duration"
          min="1"
          value={form.duration}
          onChange={handleChange}
          placeholder="Enter number of days"
          className="input input-bordered w-full"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g., Home, Hospital, Care Center"
          className="input input-bordered w-full"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Full Address</span>
        </label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter complete address with area, city"
          className="textarea textarea-bordered w-full"
          rows="3"
          required
          disabled={loading}
        />
      </div>

      {form.duration && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Cost Calculation:</p>
          <p className="text-lg font-semibold">
            ৳{service.price} × {form.duration} day(s) = ৳{service.price * Number(form.duration)}
          </p>
        </div>
      )}

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
