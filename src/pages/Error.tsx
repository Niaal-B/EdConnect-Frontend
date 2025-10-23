import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-purple-600 mb-6 animate-pulse">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Oops! Page not found.</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all"
        >
          <LucideArrowLeft className="mr-2 w-5 h-5" />
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
