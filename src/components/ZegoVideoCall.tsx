import React, { useRef, useEffect, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import api from '@/lib/api';

interface ZegoVideoCallProps {
    bookingId: string;
    onCallEnd?: () => void;
}

const ZegoVideoCall: React.FC<ZegoVideoCallProps> = ({ bookingId, onCallEnd }) => {
    const meetingContainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const markSessionAsCompleted = async () => {
        try {
            await api.patch(`/bookings/${bookingId}/complete/`);
            console.log(`Session ${bookingId} marked as completed.`);
        } catch (err) {
            console.error('Failed to mark session as completed:', err);
        }
    };

    useEffect(() => {
        if (!meetingContainerRef.current) return;

        let zc: ReturnType<typeof ZegoUIKitPrebuilt.create> | null = null;

        const initCall = async () => {
            try {
                setLoading(true);
                setError(null);

                // Securely fetch token from the backend — server secret is never exposed to the browser
                const response = await api.post('/bookings/zego/generate-token', {
                    booking_id: bookingId,
                });

                const { token, app_id, user_id, room_id, user_name } = response.data;

                zc = ZegoUIKitPrebuilt.create(token);

                setLoading(false);

                zc.joinRoom({
                    container: meetingContainerRef.current!,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall,
                    },
                    showScreenSharingButton: true,
                    userName: user_name,
                    onLeaveRoom: async () => {
                        console.log('User left the meeting');
                        await markSessionAsCompleted();
                        onCallEnd?.();
                    },
                });

            } catch (err: any) {
                console.error('Failed to initialize video call:', err);
                const msg = err?.response?.data?.error || 'Failed to start the video call. Please try again.';
                setError(msg);
                setLoading(false);
            }
        };

        initCall();

        return () => {
            zc?.destroy();
        };
    }, [bookingId]);

    if (loading) {
        return (
            <div
                style={{ width: '100vw', height: '100vh' }}
                className="flex flex-col items-center justify-center bg-gray-900 text-white gap-4"
            >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
                <p className="text-lg font-medium">Connecting to your session...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{ width: '100vw', height: '100vh' }}
                className="flex flex-col items-center justify-center bg-gray-900 text-white gap-4"
            >
                <div className="text-red-400 text-5xl">⚠️</div>
                <p className="text-lg font-semibold">Could not join session</p>
                <p className="text-sm text-gray-400 max-w-sm text-center">{error}</p>
                <button
                    onClick={() => onCallEnd?.()}
                    className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div
            className="myCallContainer"
            ref={meetingContainerRef}
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

export default ZegoVideoCall;