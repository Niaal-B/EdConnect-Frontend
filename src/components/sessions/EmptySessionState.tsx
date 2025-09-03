
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const EmptySessionState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="bg-white rounded-full p-6 mb-6 shadow-sm">
        <svg
          className="w-20 h-20 text-blue-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        You have no booked sessions yet
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Start exploring mentors to book a session and get personalized guidance for your study abroad journey.
      </p>
      
      <Link to="/mentors">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Discover Mentors
        </Button>
      </Link>
    </div>
  );
};

export default EmptySessionState;
