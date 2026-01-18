import { cookies } from "next/headers";
import api from "../library/api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  let res;
  try {
    res = await api.get("/my-bookings", {
      headers: {
        cookie,
      },
    });
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      redirect("/login");
    }
    throw err;
  }

  const bookings = res.data;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.map(b => (
        <div key={b._id} className="card bg-base-100 shadow mb-4">
          <div className="card-body">
            <h2 className="card-title">{b.serviceName}</h2>
            <p>Duration: {b.duration}</p>
            <p>Location: {b.location}</p>
            <p>Total: ৳{b.totalCost}</p>
            <p>Status: {b.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
