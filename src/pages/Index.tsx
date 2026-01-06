
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorldMap from "@/components/WorldMap";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32 bg-gradient-to-b from-white via-white to-lightgray-100 overflow-hidden">
        {/* Background decorative elements - hidden on very small screens */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-bridgeblue-50 rounded-full blur-3xl opacity-30 animate-pulse-light"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-bridgeblue-100 rounded-full blur-3xl opacity-20 animate-pulse-light" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            {/* Hero Content */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards]">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] sm:leading-tight tracking-tight">
                  Mentorship <span className="text-bridgeblue-500">Without</span> Borders
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed font-light">
                  Connect with experienced mentors who are studying abroad to get personalized guidance for your international education journey.
                </p>
              </div>
              
              {/* CTA Buttons - Touch-friendly sizing */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Link to="/student/login" className="group w-full sm:w-auto">
                  <Button 
                    className="w-full sm:w-auto bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 active:bg-bridgeblue-700 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg shadow-bridgeblue-500/25 hover:shadow-xl hover:shadow-bridgeblue-500/30 transition-all duration-300 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 min-h-[48px] touch-manipulation"
                  >
                    Join as Student
                  </Button>
                </Link>
                <Link to="/mentor/login" className="group w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto border-2 border-bridgeblue-500 text-bridgeblue-500 hover:bg-bridgeblue-50 active:bg-bridgeblue-100 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 min-h-[48px] touch-manipulation"
                  >
                    Become a Mentor
                  </Button>
                </Link>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <div className="flex -space-x-2 sm:-space-x-3 flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-200 shadow-sm"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-300 shadow-sm"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-400 shadow-sm"></div>
                </div>
                <span className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Join 500+ students & mentors</span>
              </div>
            </div>
            
            {/* World Map Visual */}
            <div className="w-full lg:w-1/2 h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[550px] xl:h-[600px] flex items-center justify-center opacity-0 animate-[fadeIn_0.7s_ease-out_0.4s_forwards]">
              <div className="relative w-full h-full">
                <WorldMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <div className="text-center group py-4">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-bridgeblue-500 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110">500+</div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">Active Mentors</p>
            </div>
            <div className="text-center group py-4">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-bridgeblue-500 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110">50+</div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">Universities</p>
            </div>
            <div className="text-center group py-4">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-bridgeblue-500 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110">20+</div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* Call To Action */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
