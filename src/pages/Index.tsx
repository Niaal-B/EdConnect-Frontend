
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-white to-lightgray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Mentorship <span className="text-bridgeblue-500">Without</span> Borders
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Connect with experienced mentors who are studying abroad to get personalized guidance for your international education journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/student/login">

                <Button className="bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 px-8">
                  Join as Student
                </Button>
                </Link>

                <Link to="/mentor/login">
                <Button variant="outline" className="border-bridgeblue-500 text-bridgeblue-500 hover:bg-bridgeblue-50 px-8">
                  Become a Mentor
                </Button>
                </Link>
          
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400"></div>
                </div>
                <span className="ml-3 text-sm text-gray-600">Join 500+ students & mentors</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 h-[400px] md:h-[500px]">
              <WorldMap />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-bridgeblue-500 mb-2">500+</div>
              <p className="text-gray-600">Active Mentors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bridgeblue-500 mb-2">50+</div>
              <p className="text-gray-600">Universities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-bridgeblue-500 mb-2">20+</div>
              <p className="text-gray-600">Countries</p>
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
