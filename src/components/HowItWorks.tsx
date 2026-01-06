
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your profile as a student or mentor.",
      color: "bg-bridgeblue-50",
    },
    {
      number: "02",
      title: "Find Matches",
      description: "Browse mentors based on your target universities and goals.",
      color: "bg-bridgeblue-100",
    },
    {
      number: "03",
      title: "Connect",
      description: "Schedule sessions and start your mentorship journey.",
      color: "bg-bridgeblue-200",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-lightgray-100 relative overflow-hidden">
      {/* Background decorative elements - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-bridgeblue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-bridgeblue-100 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight px-2">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Our simple process to connect you with the right mentor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`${step.color} rounded-2xl p-6 sm:p-7 md:p-8 lg:p-10 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-bridgeblue-500/10 hover:-translate-y-2 active:translate-y-0 active:shadow-lg`}
            >
              {/* Animated background number - smaller on mobile */}
              <span className="absolute -right-4 -top-4 sm:-right-6 sm:-top-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-bridgeblue-200 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                {step.number}
              </span>
              
              {/* Step number badge */}
              <div className="relative z-10 mb-4 sm:mb-5 md:mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bridgeblue-500 text-white font-bold text-base sm:text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-bridgeblue-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connecting line for desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-bridgeblue-300 transform -translate-y-1/2 z-20">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-bridgeblue-300 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center px-4">
          <Link to="/student/login" className="inline-block w-full sm:w-auto">
            <Button 
              className="w-full sm:w-auto bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 active:bg-bridgeblue-700 px-8 sm:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg md:text-xl h-auto font-semibold shadow-lg shadow-bridgeblue-500/25 hover:shadow-xl hover:shadow-bridgeblue-500/30 transition-all duration-300 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 min-h-[48px] touch-manipulation"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
