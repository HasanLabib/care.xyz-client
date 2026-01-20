'use client';
import Link from 'next/link';

export default function Services() {
  const serviceList = [
    { name: "Baby Care", desc: "Professional caregivers for infants and toddlers." },
    { name: "Elderly Service", desc: "Compassionate support for senior citizens." },
    { name: "Sick People Service", desc: "Qualified care for unwell family members." },
  ];

  return (
    <section id="services" className="bg-gray-50 py-24">
      <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
        {serviceList.map((service) => (
          <div key={service.name} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.desc}</p>
            <Link href="/services">
              <button className="btn btn-sm btn-primary mt-4">View All Services</button>
            </Link>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Link href="/services">
          <button className="btn btn-primary btn-lg">Browse All Services</button>
        </Link>
      </div>
    </section>
  );
}
