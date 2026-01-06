
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-bridgeblue-500 overflow-hidden">
      {/* Background decorative elements - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6 opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards] px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] sm:leading-tight tracking-tight">
              Ready to Start Your Global Education Journey?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed font-light">
              Join thousands of students and mentors on BridgeUp today and take the first step toward your international education goals.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center pt-2 sm:pt-4 px-4">
            <Link to="/student/login" className="group w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto bg-white text-bridgeblue-500 hover:bg-gray-50 active:bg-gray-100 px-8 sm:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg md:text-xl h-auto font-semibold shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-bridgeblue-500 min-h-[48px] touch-manipulation"
              >
                Join as a Student
              </Button>
            </Link>
            <Link to="/mentor/login" className="group w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto bg-white text-bridgeblue-500 hover:bg-gray-50 active:bg-gray-100 px-8 sm:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg md:text-xl h-auto font-semibold shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/25 transition-all duration-300 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-bridgeblue-500 min-h-[48px] touch-manipulation"
              >
                Become a Mentor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
