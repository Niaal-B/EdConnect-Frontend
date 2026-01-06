
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
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32 bg-gradient-to-b from-white via-white to-lightgray-100 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-bridgeblue-50 rounded-full blur-3xl opacity-30 animate-pulse-light"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-bridgeblue-100 rounded-full blur-3xl opacity-20 animate-pulse-light" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Hero Content */}
            <div className="w-full lg:w-1/2 space-y-8 opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards]">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                  Mentorship <span className="text-bridgeblue-500">Without</span> Borders
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-light">
                  Connect with experienced mentors who are studying abroad to get personalized guidance for your international education journey.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/student/login" className="group">
                  <Button 
                    className="w-full sm:w-auto bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 px-8 py-6 text-base sm:text-lg font-semibold shadow-lg shadow-bridgeblue-500/25 hover:shadow-xl hover:shadow-bridgeblue-500/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
                  >
                    Join as Student
                  </Button>
                </Link>
                <Link to="/mentor/login" className="group">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto border-2 border-bridgeblue-500 text-bridgeblue-500 hover:bg-bridgeblue-50 px-8 py-6 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
                  >
                    Become a Mentor
                  </Button>
                </Link>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 shadow-sm transition-transform hover:scale-110"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 shadow-sm transition-transform hover:scale-110" style={{ transitionDelay: '0.1s' }}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400 shadow-sm transition-transform hover:scale-110" style={{ transitionDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm sm:text-base text-gray-600 font-medium">Join 500+ students & mentors</span>
              </div>
            </div>
            
            {/* World Map Visual */}
            <div className="w-full lg:w-1/2 h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center opacity-0 animate-[fadeIn_0.7s_ease-out_0.4s_forwards]">
              <div className="relative w-full h-full">
                <WorldMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center group">
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-bridgeblue-500 mb-3 transition-transform duration-300 group-hover:scale-110">500+</div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Active Mentors</p>
            </div>
            <div className="text-center group">
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-bridgeblue-500 mb-3 transition-transform duration-300 group-hover:scale-110">50+</div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Universities</p>
            </div>
            <div className="text-center group">
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-bridgeblue-500 mb-3 transition-transform duration-300 group-hover:scale-110">20+</div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Countries</p>
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
