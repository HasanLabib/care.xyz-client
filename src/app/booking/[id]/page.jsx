"use client";
 
 import { useRouter } from "next/navigation";
 import { useState, useEffect } from "react";
 import api from "../../library/api";



 

export default function BookingPage({ params }) {
  const router = useRouter();
  const serviceId = params.id;

  const [service, setService] = useState(null);
  const [duration, setDuration] = useState(1);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const totalCost = service ? service.price * duration : 0;

  useEffect(() => {
    api.get(`/service/${serviceId}`).then((res) => {
      setService(res.data);
      setLoading(false);
    });
  }, [serviceId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    const bookingData = {
      serviceId: service._id,
      serviceName: service.name,
      duration,
      location,
      address,
      totalCost,
    };

    try {
      await api.post("/booking", bookingData);
      router.push("/my-bookings");
    } catch (err) {
      alert("You must be logged in to book a service.");
      router.push("/login");
    }
  };

  if (loading)
    return <div className="p-20 text-center">Loading service...</div>;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Book Service: {service.name}</h1>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="label">Select Duration (days)</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Location</label>
              <input
                type="text"
                placeholder="Division, District, City, Area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Full Address</label>
              <textarea
                placeholder="House, Road, Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="textarea textarea-bordered w-full"
                required
              />
            </div>

            <div className="alert alert-info">
              <span>
                Total Cost: <b>৳ {totalCost}</b>
              </span>
            </div>

            <button className="btn btn-primary w-full">Confirm Booking</button>
          </form>
        </div>
      </div>
    </div>
  );
}
