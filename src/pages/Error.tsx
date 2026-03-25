import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-indigo-100/40 rounded-full blur-3xl" />

      <div className="max-w-xl w-full relative">
        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] p-8 md:p-12 text-center">
          
          {/* Main Icon with Glow */}
          <div className="relative mb-10 inline-block">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-4 bg-gradient-to-br from-blue-700 to-indigo-800 bg-clip-text text-transparent tracking-tighter">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Something went wrong...
          </h2>
          
          <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been moved or doesn't exist anymore. Let's get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="w-full sm:w-auto px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              size="lg"
              className="w-full sm:w-auto px-8 rounded-2xl border-gray-200 hover:bg-white hover:border-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Quick Support Link */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Need help? <a href="#" className="text-blue-600 font-medium hover:underline">Contact Support</a>
            </p>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="hidden lg:block absolute -left-16 top-1/2 -translate-y-1/2">
           <RefreshCw className="w-12 h-12 text-blue-100 animate-[spin_8s_linear_infinite]" />
        </div>
        <div className="hidden lg:block absolute -right-12 bottom-12">
           <div className="w-8 h-8 rounded-full border-4 border-indigo-100 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
