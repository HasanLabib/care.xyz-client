'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/app/library/api';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    duration: '',
    location: '',
    address: '',
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/service/${params.id}`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookingData = {
        serviceId: params.id,
        serviceName: service.name,
        duration: formData.duration,
        location: formData.location,
        address: formData.address,
        totalCost: service.price * parseInt(formData.duration),
      };

      await api.post('/booking', bookingData);
      alert('Booking placed successfully!');
      router.push('/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to place booking. Please try again.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!service) return <div className="p-8">Service not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Book {service.name}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <p className="text-lg font-semibold">Price: ${service.price}/hour</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Duration (hours)</label>
          <input
            type="number"
            min="1"
            required
            className="w-full p-2 border rounded"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Location Type</label>
          <select
            required
            className="w-full p-2 border rounded"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          >
            <option value="">Select location</option>
            <option value="home">At Home</option>
            <option value="facility">At Facility</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            required
            className="w-full p-2 border rounded"
            rows="3"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        {formData.duration && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p className="font-semibold">
              Total Cost: ${service.price * parseInt(formData.duration)}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Place Booking
        </button>
      </form>
    </div>
  );
}