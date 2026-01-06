
import { Card } from "@/components/ui/card";
import { Globe, GraduationCap, FileText, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with mentors from top universities around the world.",
    },
    {
      icon: GraduationCap,
      title: "Personalized Guidance",
      description: "Get customized advice for your academic journey from those who've been there.",
    },
    {
      icon: FileText,
      title: "Application Support",
      description: "Receive help with applications, essays, and interview preparation.",
    },
    {
      icon: Users,
      title: "Cultural Adaptation",
      description: "Learn how to adapt to new cultures and environments abroad.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight px-2">
            Why Choose BridgeUp
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
            We connect ambitious students with experienced mentors to help navigate the journey of studying abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative p-6 sm:p-7 md:p-8 border border-gray-200 rounded-xl hover:shadow-xl hover:shadow-bridgeblue-500/10 active:shadow-lg transition-all duration-300 hover:-translate-y-2 active:translate-y-0 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-bridgeblue-500 focus-within:ring-offset-2 touch-manipulation"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-bridgeblue-50/0 to-bridgeblue-50/0 group-hover:from-bridgeblue-50/50 group-hover:to-transparent transition-all duration-300"></div>
              
              <div className="relative z-10">
                <div className="mb-4 sm:mb-5 md:mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-bridgeblue-500 group-hover:text-bridgeblue-600 transition-colors duration-300" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-bridgeblue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
