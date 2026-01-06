
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: "🌍",
      title: "Global Network",
      description: "Connect with mentors from top universities around the world.",
    },
    {
      icon: "🎓",
      title: "Personalized Guidance",
      description: "Get customized advice for your academic journey from those who've been there.",
    },
    {
      icon: "📖",
      title: "Application Support",
      description: "Receive help with applications, essays, and interview preparation.",
    },
    {
      icon: "🤝",
      title: "Cultural Adaptation",
      description: "Learn how to adapt to new cultures and environments abroad.",
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Why Choose BridgeUp
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            We connect ambitious students with experienced mentors to help navigate the journey of studying abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative p-8 border border-gray-200 rounded-xl hover:shadow-xl hover:shadow-bridgeblue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-bridgeblue-500 focus-within:ring-offset-2"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-bridgeblue-50/0 to-bridgeblue-50/0 group-hover:from-bridgeblue-50/50 group-hover:to-transparent transition-all duration-300"></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-bridgeblue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
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
