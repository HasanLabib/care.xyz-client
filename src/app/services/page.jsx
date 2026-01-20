'use client';

import { useEffect, useState } from 'react';
import ServiceCard from "@/components/ServiceCard";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Use API proxy for consistent routing and cookie handling
        const response = await fetch('/api/services', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          setError(`Failed to load services (${response.status})`);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Unable to connect to services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Care Services</h1>
        <div className="text-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Care Services</h1>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium">Error Loading Services</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Care Services</h1>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No services available at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
