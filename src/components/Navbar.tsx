
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className={`w-full py-4 bg-white/95 backdrop-blur-md fixed top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2.5 group transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 rounded-lg p-1"
          aria-label="EdConnect Home"
        >
          <div className="w-9 h-9 rounded-full bg-bridgeblue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <span className="font-bold text-white text-sm">B</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">EdConnect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            to="/" 
            className="px-4 py-2 text-gray-700 hover:text-bridgeblue-600 font-medium text-sm transition-colors duration-200 rounded-md hover:bg-bridgeblue-50 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 text-gray-700 hover:text-bridgeblue-600 font-medium text-sm transition-colors duration-200 rounded-md hover:bg-bridgeblue-50 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
          >
            About
          </Link>
          <Link 
            to="/mentors/login" 
            className="px-4 py-2 text-gray-700 hover:text-bridgeblue-600 font-medium text-sm transition-colors duration-200 rounded-md hover:bg-bridgeblue-50 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
          >
            Mentors
          </Link>
          <Link 
            to="/student/login" 
            className="px-4 py-2 text-gray-700 hover:text-bridgeblue-600 font-medium text-sm transition-colors duration-200 rounded-md hover:bg-bridgeblue-50 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
          >
            Students
          </Link>
        </div>

        {/* Authentication buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-2 border-bridgeblue-500 text-bridgeblue-500 hover:bg-bridgeblue-50 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
            asChild
          >
            <Link to="/student/login">Login as Student</Link>
          </Button>
          <Button 
            className="bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 px-5 py-2.5 text-sm font-semibold shadow-md shadow-bridgeblue-500/25 hover:shadow-lg hover:shadow-bridgeblue-500/30 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
            asChild
          >
            <Link to="/mentor/login">Login as Mentor</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2 rounded-md p-2 transition-colors duration-200 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-4 space-y-2">
          <Link 
            to="/" 
            className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2.5 px-2 rounded-md hover:bg-bridgeblue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2.5 px-2 rounded-md hover:bg-bridgeblue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/mentors/login" 
            className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2.5 px-2 rounded-md hover:bg-bridgeblue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Mentors
          </Link>
          <Link 
            to="/student/login" 
            className="block text-gray-700 hover:text-bridgeblue-600 font-medium py-2.5 px-2 rounded-md hover:bg-bridgeblue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-bridgeblue-500 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Students
          </Link>
          <div className="pt-4 space-y-2 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full border-2 border-bridgeblue-500 text-bridgeblue-500 hover:bg-bridgeblue-50 font-semibold"
              asChild
            >
              <Link to="/student/login" onClick={() => setIsMenuOpen(false)}>Login as Student</Link>
            </Button>
            <Button 
              className="w-full bg-bridgeblue-500 text-white hover:bg-bridgeblue-600 font-semibold shadow-md"
              asChild
            >
              <Link to="/mentor/login" onClick={() => setIsMenuOpen(false)}>Login as Mentor</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
