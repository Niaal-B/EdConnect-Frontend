
import { Card } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "BridgeUp connected me with a mentor who helped me navigate the complex application process for Oxford. Their insights were invaluable!",
      name: "Priya M.",
      role: "Student, Oxford University",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    },
    {
      quote: "As a mentor, I love helping students achieve their dreams of studying abroad. The platform makes it easy to connect and schedule sessions.",
      name: "James K.",
      role: "Mentor, Stanford University",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight px-2">
            Success Stories
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Hear from students and mentors who've connected through BridgeUp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group p-6 sm:p-7 md:p-8 lg:p-10 border border-gray-200 rounded-2xl hover:shadow-xl hover:shadow-bridgeblue-500/10 active:shadow-lg transition-all duration-300 hover:-translate-y-2 active:translate-y-0 bg-white focus-within:ring-2 focus-within:ring-bridgeblue-500 focus-within:ring-offset-2"
            >
              <div className="flex flex-col h-full">
                {/* Quote icon */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <svg 
                    className="w-10 h-10 sm:w-12 sm:h-12 text-bridgeblue-500/20 group-hover:text-bridgeblue-500/30 transition-colors duration-300" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                <div className="flex-grow mb-6 sm:mb-7 md:mb-8">
                  <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed font-light italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex items-center pt-4 sm:pt-5 md:pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 ring-2 ring-bridgeblue-100 group-hover:ring-bridgeblue-300 transition-all duration-300 shadow-md flex-shrink-0">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg mb-1 truncate">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 truncate">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
