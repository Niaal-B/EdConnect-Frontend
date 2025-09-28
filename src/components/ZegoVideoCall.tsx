import React, { useRef, useEffect } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import api from '@/lib/api';

const ZegoVideoCall = ({ roomId, userId, userName }) => {
    const meetingContainerRef = useRef(null);


    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
    console.log("tis is the things from env",appID)

    const markSessionAsCompleted = async () => {
        try {
            await api.patch(`/bookings/${roomId}/complete/`);
            console.log(`Session ${roomId} marked as completed.`);
        } catch (error) {
            console.error('Failed to mark session as completed:', error);
        }
    };

    useEffect(() => {
        if (!meetingContainerRef.current) return;

        const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            userId,
            userName
        );

        const zc = ZegoUIKitPrebuilt.create(token);

        zc.joinRoom({
            container: meetingContainerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            userName: userName,

            onLeaveRoom: async () => {
                console.log("User left the meeting");
                await markSessionAsCompleted();
            },
        });

        return () => {
            zc.destroy();
        };
    }, [roomId, userId, userName]);

    return (
        <div
            className="myCallContainer"
            ref={meetingContainerRef}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
};

export default ZegoVideoCall;