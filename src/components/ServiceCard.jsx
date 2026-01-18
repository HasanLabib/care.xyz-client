import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition">
      <figure>
        <Image
          src={service.image}
          alt={service.name}
          width={800}
          height={450}
          className="h-48 w-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{service.name}</h2>
        <p className="text-sm text-gray-600">{service.description}</p>

        <p className="font-bold text-lg text-primary">
          ৳ {service.price} / day
        </p>

        <div className="card-actions justify-end">
          <Link
            href={`/service/${service._id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
