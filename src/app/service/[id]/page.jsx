import Image from "next/image";
import BookingForm from "./BookingForm";
import api from "@/app/library/api";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ServiceDetailsPage({ params }) {
  let service = null;

  try {
    const cookieStore = cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await api.get(`/service/${params.id}`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    service = res.data;
  } catch (err) {
    console.error("Failed to fetch service:", err?.response?.data || err.message);
  }

  if (!service) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>Service not found.</p>
      </div>
    );
  }

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

      <BookingForm service={service} />
    </div>
  );
}
