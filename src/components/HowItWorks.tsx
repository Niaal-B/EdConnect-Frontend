
import { Button } from "@/components/ui/button";

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
    <section className="py-16 bg-lightgray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple process to connect you with the right mentor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`${step.color} rounded-lg p-8 relative overflow-hidden`}
            >
              <span className="absolute -right-4 -top-4 text-6xl font-bold text-bridgeblue-200 opacity-20">
                {step.number}
              </span>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 px-8 py-6 text-lg h-auto">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
