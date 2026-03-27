import React, { useRef, useEffect, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import api from '@/lib/api';

interface ZegoVideoCallProps {
    bookingId: string;
    onCallEnd?: () => void;
}

const ZegoVideoCall: React.FC<ZegoVideoCallProps> = ({ bookingId, onCallEnd }) => {
    const meetingContainerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const zegoRef = useRef<ReturnType<typeof ZegoUIKitPrebuilt.create> | null>(null);

    const markSessionAsCompleted = async () => {
        try {
            await api.patch(`/bookings/${bookingId}/complete/`);
        } catch (err) {
            console.error('Failed to mark session as completed:', err);
        }
    };

    useEffect(() => {
        const initCall = async () => {
            try {
                // 1. Fetch a secure token from the backend
                const response = await api.post('/bookings/zego/generate-token', {
                    booking_id: bookingId,
                });

                const { token, user_name } = response.data;

                // 2. Create the Zego instance
                const zc = ZegoUIKitPrebuilt.create(token);
                zegoRef.current = zc;

                // 3. Mark as ready — React will re-render, mounting the container div
                setStatus('ready');

            } catch (err: any) {
                console.error('Failed to initialize video call:', err);
                const msg = err?.response?.data?.error || 'Failed to start the video call. Please try again.';
                setErrorMsg(msg);
                setStatus('error');
            }
        };

        initCall();

        return () => {
            zegoRef.current?.destroy();
        };
    }, [bookingId]);

    // 4. Once 'ready' and the container div is in the DOM, join the room
    useEffect(() => {
        if (status !== 'ready' || !meetingContainerRef.current || !zegoRef.current) return;

        zegoRef.current.joinRoom({
            container: meetingContainerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            onLeaveRoom: async () => {
                await markSessionAsCompleted();
                onCallEnd?.();
            },
        });
    }, [status]); // Runs only when status changes to 'ready'

    if (status === 'error') {
        return (
            <div
                style={{ width: '100vw', height: '100vh' }}
                className="flex flex-col items-center justify-center bg-gray-900 text-white gap-4"
            >
                <div className="text-5xl">⚠️</div>
                <p className="text-lg font-semibold text-red-400">Could not join session</p>
                <p className="text-sm text-gray-400 max-w-sm text-center">{errorMsg}</p>
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
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* Loading overlay — shown on top while token is being fetched */}
            {status === 'loading' && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white gap-4 z-10"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
                    <p className="text-lg font-medium">Connecting to your session...</p>
                </div>
            )}
            {/* Container always stays in the DOM so the ref is valid when joinRoom is called */}
            <div
                className="myCallContainer"
                ref={meetingContainerRef}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default ZegoVideoCall;