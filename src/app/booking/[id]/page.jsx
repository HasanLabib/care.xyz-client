'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/app/library/api';
import PrivateRoute from '@/components/PrivateRoute';

export default function BookingConfirmationPage() {
    const params = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                // Fetch booking details by ID
                const response = await api.get(`/my-bookings`);
                const bookings = response.data;
                const foundBooking = bookings.find(b => b._id === params.id);

                if (foundBooking) {
                    setBooking(foundBooking);
                } else {
                    setError('Booking not found');
                }
            } catch (err) {
                console.error('Failed to fetch booking:', err);
                setError('Unable to load booking details');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBooking();
        }
    }, [params.id]);

    if (loading) {
        return (
            <PrivateRoute>
                <div className="max-w-4xl mx-auto p-10">
                    <div className="text-center py-12">
                        <div className="loading loading-spinner loading-lg"></div>
                        <p className="mt-4 text-gray-600">Loading booking details...</p>
                    </div>
                </div>
            </PrivateRoute>
        );
    }

    if (error || !booking) {
        return (
            <PrivateRoute>
                <div className="max-w-4xl mx-auto p-10">
                    <div className="text-center mt-10">
                        <h1 className="text-2xl font-bold mb-4 text-red-600">Booking Not Found</h1>
                        <p className="text-gray-600 mb-4">{error || 'The booking you\'re looking for doesn\'t exist.'}</p>
                        <a href="/my-bookings" className="btn btn-primary">
                            Back to My Bookings
                        </a>
                    </div>
                </div>
            </PrivateRoute>
        );
    }

    return (
        <PrivateRoute>
            <div className="max-w-4xl mx-auto p-10">
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h1 className="card-title text-3xl mb-6">Booking Confirmation</h1>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Service Details</h2>
                                <div className="space-y-2">
                                    <p><span className="font-bold">Service:</span> {booking.serviceName}</p>
                                    <p><span className="font-bold">Duration:</span> {booking.duration} day(s)</p>
                                    <p><span className="font-bold">Total Cost:</span> ৳{booking.totalCost}</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Location Details</h2>
                                <div className="space-y-2">
                                    <p><span className="font-bold">Location:</span> {booking.location}</p>
                                    <p><span className="font-bold">Address:</span> {booking.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <p><span className="font-bold">Booking ID:</span> {booking._id}</p>
                                <p><span className="font-bold">Status:</span>
                                    <span className={`badge ml-2 ${booking.status === "Pending" ? "badge-warning" :
                                            booking.status === "Cancelled" ? "badge-error" : "badge-success"
                                        }`}>
                                        {booking.status}
                                    </span>
                                </p>
                                <p><span className="font-bold">Booked On:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                                {booking.cancelledAt && (
                                    <p><span className="font-bold">Cancelled On:</span> {new Date(booking.cancelledAt).toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <a href="/my-bookings" className="btn btn-outline">
                                View All Bookings
                            </a>
                            <a href="/services" className="btn btn-primary">
                                Book Another Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}