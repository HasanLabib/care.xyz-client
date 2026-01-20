'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import BookingForm from "./BookingForm";
import api from "@/app/library/api";

export default function ServiceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Use axios api instance for consistent error handling
        const response = await api.get(`/service/${params.id}`);
        setService(response.data);
      } catch (err) {
        console.error("Failed to fetch service:", err.message);
        if (err.response?.status === 404) {
          setError('Service not found');
        } else {
          setError('Unable to connect to service. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-10">
        <div className="text-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto p-10">
        <div className="text-center mt-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              {error === 'Service not found' ? 'Service Not Found' : 'Error Loading Service'}
            </h1>
            <p className="text-red-500 mb-4">
              {error === 'Service not found' 
                ? "The service you're looking for doesn't exist or has been removed."
                : error
              }
            </p>
            <div className="space-x-4">
              <a href="/services" className="btn btn-primary">
                Back to Services
              </a>
              {error !== 'Service not found' && (
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-outline"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <Image
        src={service.image || "/placeholder.svg"}
        width={1200}
        height={800}
        className="rounded-xl mb-6"
        alt={service.name}
        priority
      />

      <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
      <p className="mb-4 text-gray-600 text-lg">{service.description}</p>

      <p className="text-2xl font-bold text-primary mb-6">
        ৳ {service.price} / day
      </p>

      <BookingForm service={service} />
    </div>
  );
}