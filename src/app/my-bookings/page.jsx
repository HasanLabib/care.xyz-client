"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import api from "../library/api";

export default function MyBookingsPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/my-bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    // Add confirmation dialog
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await api.patch(`/cancel-booking/${bookingId}`);
      // Update the booking status in the local state
      setBookings(bookings.map(booking =>
        booking._id === bookingId
          ? { ...booking, status: 'Cancelled', cancelledAt: new Date() }
          : booking
      ));
      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">You have no bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="card bg-base-100 shadow mb-6">
              <div className="card-body">
                <h2 className="card-title text-xl font-semibold">
                  {b.serviceName}
                </h2>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <p>
                    <span className="font-bold">Duration:</span> {b.duration} day(s)
                  </p>
                  <p>
                    <span className="font-bold">Location:</span> {b.location}
                  </p>
                  <p>
                    <span className="font-bold">Address:</span> {b.address}
                  </p>
                  <p>
                    <span className="font-bold">Total:</span> ৳{b.totalCost}
                  </p>
                  <p>
                    <span className="font-bold">Status:</span>{" "}
                    <span
                      className={`badge ${b.status === "Pending"
                          ? "badge-warning"
                          : b.status === "Cancelled"
                            ? "badge-error"
                            : "badge-success"
                        }`}
                    >
                      {b.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Booked:</span>{" "}
                    {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {b.status === "Pending" && (
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleCancelBooking(b._id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </PrivateRoute>
  );
}
