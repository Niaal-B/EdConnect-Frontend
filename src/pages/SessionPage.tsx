// src/pages/MentorSession.js

import React, { useState, useEffect } from 'react';
import ZegoVideoCall from '@/components/ZegoVideoCall';

const MentorSession = () => {
    // These values would come from your backend API call
    const [sessionDetails, setSessionDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Assume you have a function to fetch the session data
        const fetchSessionData = async () => {
            // In a real app, this would be an API call
            // For example: const response = await fetch('/api/session/123');
            // const data = await response.json();
            
            // Using placeholder data for now
            const data = {
                roomId: 'mentorship-session-abc',
                userId: 'user-xyz', // The ID of the current logged-in user
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
            {/* You can add other page elements here, like a session title or details */}
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