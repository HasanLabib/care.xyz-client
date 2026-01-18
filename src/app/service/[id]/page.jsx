
import api from "@/app/library/api";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic"; // SSR

export default async function ServiceDetailsPage({ params }) {
  const res = await api.get(`/service/${params.id}`);
  const service = res.data;

  return (
    <div className="max-w-4xl mx-auto p-10">
      <Image
        src={service.image}
        width={1200}
        height={800}
        className="rounded-xl mb-6"
        alt={service.name}
      />

      <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
      <p className="mb-4 text-gray-600">{service.description}</p>

      <p className="text-2xl font-bold text-primary">
        ৳ {service.price} / day
      </p>

      <Link
        href={`/booking/${service._id}`}
        className="btn btn-primary mt-6"
      >
        Book This Service
      </Link>
    </div>
  );
}
