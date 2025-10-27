
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 bg-white/90 backdrop-blur-sm fixed top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-bridgeblue-500 flex items-center justify-center">
            <span className="font-bold text-white">B</span>
          </div>
          <span className="text-xl font-bold text-gray-800">EdConnect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-bridgeblue-600 font-medium">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-bridgeblue-600 font-medium">
            About
          </Link>
          <Link to="/mentors/login" className="text-gray-700 hover:text-bridgeblue-600 font-medium">
            Mentors
          </Link>
          <Link to="/student/login" className="text-gray-700 hover:text-bridgeblue-600 font-medium">
            Students
          </Link>
        </div>

        {/* Authentication buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-bridgeblue-500 text-bridgeblue-500 hover:bg-bridgeblue-50">
          <Link to="/student/login">Login as a Student</Link>
          </Button>
          <Button className="bg-bridgeblue-500 text-white hover:bg-bridgeblue-600">
          <Link to="/mentor/login">Login as Mentor</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link to="/" className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2">
              Home
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2">
              About
            </Link>
            <Link to="/mentors" className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2">
              Mentors
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2">
              Contact
            </Link>
            <div className="pt-2 space-y-2">
              <Button variant="outline" className="w-full border-bridgeblue-500 text-bridgeblue-500 hover:bg-bridgeblue-50">
                Log in
              </Button>
              <Button className="w-full bg-bridgeblue-500 text-white hover:bg-bridgeblue-600">
                Join us
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
