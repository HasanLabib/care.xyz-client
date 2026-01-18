"use client";

import api from "@/app/library/api";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ServiceDetailsPage({ params }) {
  const [service, setService] = useState(null);
  const [form, setForm] = useState({
    duration: "",
    location: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // fetch service details
  useState(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/service/${params.id}`);
        setService(res.data);
      } catch (err) {
        console.error("Service fetch error:", err);
      }
    };
    fetchService();
  }, []);

  if (!service) return <p className="text-center mt-10">Loading service...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalCost = service.price * Number(form.duration || 1);

      const res = await api.post("/booking", {
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
    <div className="max-w-4xl mx-auto p-10">
      <Image
        src={service.image || "/placeholder.jpg"}
        width={1200}
        height={800}
        className="rounded-xl mb-6"
        alt={service.name}
      />

      <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
      <p className="mb-4 text-gray-600">{service.description}</p>

      <p className="text-2xl font-bold text-primary mb-6">
        ৳ {service.price} / day
      </p>

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
    </div>
  );
}
