'use client';

import { useEffect, useState } from 'react';
import ServiceCard from "@/components/ServiceCard";
import api from "@/app/library/api";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchServices = async () => {
      try {
        // Use axios api instance for consistent error handling and token refresh
        const response = await api.get('/services');
        if (isMounted) {
          setServices(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        if (isMounted) {
          // More specific error messages based on error type
          if (err.response?.status === 500) {
            setError('Server error. Our team has been notified. Please try again in a few minutes.');
          } else if (err.response?.status === 404) {
            setError('Services endpoint not found. Please contact support.');
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            setError('Network connection error. Please check your internet connection.');
          } else {
            setError('Unable to load services. Please try again later.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
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

      <p className="text-center text-gray-600 mb-8">
        Discover our comprehensive care services designed to meet your family's needs.
      </p>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No services available at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">Please check back later for updates.</p>
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
