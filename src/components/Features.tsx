
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose BridgeUp</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We connect ambitious students with experienced mentors to help navigate the journey of studying abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
