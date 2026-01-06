
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
    <section className="py-20 md:py-28 bg-lightgray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-bridgeblue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-bridgeblue-100 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Our simple process to connect you with the right mentor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`${step.color} rounded-2xl p-8 md:p-10 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-bridgeblue-500/10 hover:-translate-y-2`}
            >
              {/* Animated background number */}
              <span className="absolute -right-6 -top-6 text-7xl md:text-8xl font-bold text-bridgeblue-200 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                {step.number}
              </span>
              
              {/* Step number badge */}
              <div className="relative z-10 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bridgeblue-500 text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-bridgeblue-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connecting line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-bridgeblue-300 transform -translate-y-1/2 z-20">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-bridgeblue-300 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/student/login">
            <Button 
              className="bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 px-10 py-7 text-lg md:text-xl h-auto font-semibold shadow-lg shadow-bridgeblue-500/25 hover:shadow-xl hover:shadow-bridgeblue-500/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
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
