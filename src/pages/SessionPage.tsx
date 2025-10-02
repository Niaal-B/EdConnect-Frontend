
import React, { useState, useEffect } from 'react';
import ZegoVideoCall from '@/components/ZegoVideoCall';

const MentorSession = () => {
    const [sessionDetails, setSessionDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessionData = async () => {

            const data = {
                roomId: 'mentorship-session-abc',
                userId: 'user-xyz', 
                userName: 'Mentor Name'
            };
            setSessionDetails(data);
            setLoading(false);
        };
        fetchSessionData();
    }, []);

    if (loading) {
        return <div>Loading session details...</div>;
    }

    if (!sessionDetails) {
        return <div>Session not found.</div>;
    }

    return (
        <div>
            <h1>Welcome to your Mentorship Session!</h1>
            <ZegoVideoCall 
                roomId={sessionDetails.roomId}
                userId={sessionDetails.userId}
                userName={sessionDetails.userName}
            />
        </div>
    );
};

export default MentorSession;