
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-bridgeblue-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Global Education Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of students and mentors on BridgeUp today and take the first step toward your international education goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-bridgeblue-500 hover:bg-gray-100 px-8 py-6 text-lg h-auto" asChild>
              <Link to="/student/login">Join as a Student</Link>
            </Button>
            <Button className="bg-white text-bridgeblue-500 hover:bg-gray-100 px-8 py-6 text-lg h-auto" asChild>
              <Link to="/mentor/login">Become a Mentor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
