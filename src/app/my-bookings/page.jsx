import api from "@/app/library/api"; // client-side axios
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  let bookings = [];

  try {
    const res = await api.get("/my-bookings");
    bookings = res.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      redirect("/login");
    }
    console.error(err);
  }

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
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
                  <span className="font-bold">Duration:</span> {b.duration}
                </p>
                <p>
                  <span className="font-bold">Location:</span> {b.location}
                </p>
                <p>
                  <span className="font-bold">Total:</span> ৳{b.totalCost}
                </p>
                <p>
                  <span className="font-bold">Status:</span>{" "}
                  <span
                    className={`badge ${
                      b.status === "Pending"
                        ? "badge-warning"
                        : b.status === "Cancelled"
                          ? "badge-error"
                          : "badge-success"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
