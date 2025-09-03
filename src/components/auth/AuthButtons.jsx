import React from 'react';

const GoogleAuthButtons = () => {
    const GOOGLE_CLIENT_ID = "282993882148-iok4nnp3633isofiuhlsinflfmav87pg.apps.googleusercontent.com";
    const GOOGLE_REDIRECT_URI = 'http://localhost/api/auth/google/callback/';
    const GOOGLE_SCOPES = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar',
        'openid'
    ].join(' ');

    const AUTH_PARAMS = {
        'access_type': 'offline',
        'prompt': 'consent'
    };

    const buildGoogleAuthUrl = (role) => {
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            response_type: 'code',
            scope: GOOGLE_SCOPES,
            ...AUTH_PARAMS,
            state: role
        });
        return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
    };

    const handleGoogleLogin = (role) => {
        const authUrl = buildGoogleAuthUrl(role);
        window.location.href = authUrl;
    };

    const GoogleIcon = () => (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
    );

    return (
        <div className="space-y-3 mt-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => handleGoogleLogin('student')}
                    className="flex items-center justify-center px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <GoogleIcon />
                    Student
                </button>
                
                <button
                    onClick={() => handleGoogleLogin('mentor')}
                    className="flex items-center justify-center px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <GoogleIcon />
                    Mentor
                </button>
            </div>
        </div>
    );
};

export default GoogleAuthButtons;