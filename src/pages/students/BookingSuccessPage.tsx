import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing URL query parameters
import { Button } from "@/components/ui/button"; // Assuming you have this
import { CheckCircle } from "lucide-react"; // For a success icon
import api from '@/lib/api';

const BookingSuccessPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');
    console.log(sessionId)

    const [bookingDetails, setBookingDetails] = useState<any>(null); // State to store fetched booking details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionId) {


            const fetchBookingStatus = async () => {
                try {
                   
                    const response = await api.get(`bookings/status/${sessionId}/`);
                    setBookingDetails(response.data);
                } catch (err) {
                    console.error("Failed to fetch booking details:", err);
                    setError("Could not retrieve booking details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchBookingStatus();
        } else {
            setError("No Stripe session ID found in URL.");
            setLoading(false);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-700">Confirming your booking...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-6">
                <CheckCircle className="h-20 w-20 text-red-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">Payment Confirmation Issue</h1>
                <p className="text-lg text-center mb-6">{error}</p>
                <Button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-700 p-6">
            <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-center mb-6">Your session has been successfully booked and paid for.</p>

            {bookingDetails && (
                <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Session Details</h2>
                    <p className="mb-2"><strong>Mentor:</strong> {bookingDetails.mentor_info?.full_name || bookingDetails.mentor_info?.email}</p>
                    <p className="mb-2"><strong>Time:</strong> {new Date(bookingDetails.booked_start_time).toLocaleString()} - {new Date(bookingDetails.booked_end_time).toLocaleTimeString()}</p>
                    <p className="mb-2"><strong>Fee:</strong> ${parseFloat(bookingDetails.booked_fee).toFixed(2)}</p>
                    <p className="mb-2"><strong>Status:</strong> <span className="font-semibold text-green-600">{bookingDetails.status}</span></p>
                </div>
            )}

            <Button onClick={() => window.location.href = '/student/dashboard'} className="mt-8">Go to Dashboard</Button>
        </div>
    );
};

export default BookingSuccessPage;