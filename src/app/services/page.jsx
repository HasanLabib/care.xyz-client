import ServiceCard from "@/components/ServiceCard";
import api from "../library/api";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // SSR

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
  
  let services = [];
  try {
    const res = await api.get("/services", {
      headers: { cookie },
    });
    services = res.data;
  } catch {
    services = [];
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Care Services</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
}
