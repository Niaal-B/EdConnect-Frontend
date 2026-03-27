import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZegoVideoCall from '@/components/ZegoVideoCall';
import api from '@/lib/api';

const SessionPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (!bookingId) {
            setError('No session ID provided.');
            setLoading(false);
            return;
        }

        // Validate that the booking exists and the user has access before launching the call
        const validateBooking = async () => {
            try {
                await api.post('/bookings/zego/generate-token', { booking_id: bookingId });
                setIsValid(true);
            } catch (err: any) {
                const msg = err?.response?.data?.error || 'You cannot access this session.';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        validateBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
            </div>
        );
    }

    if (error || !isValid || !bookingId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-4">
                <p className="text-red-400 text-xl font-semibold">Unable to join session</p>
                <p className="text-gray-400 text-sm">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <ZegoVideoCall
            bookingId={bookingId}
            onCallEnd={() => navigate(-1)}
        />
    );
};

export default SessionPage;