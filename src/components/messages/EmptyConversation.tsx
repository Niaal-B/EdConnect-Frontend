
import React from "react";
import { GraduationCap } from "lucide-react";

const EmptyConversation: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-white rounded-r-lg p-6">
      <div className="text-center max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm border border-indigo-100">
        <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-10 w-10 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">Connect with Study Abroad Mentors</h3>
        <p className="text-gray-600 mb-6">
          Select a mentor to receive personalized guidance on university applications, scholarships, and your study abroad journey.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-indigo-600 mb-1">Academic Advice</p>
            <p className="text-sm text-gray-700">Get guidance on course selection and universities</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-indigo-600 mb-1">Visa Support</p>
            <p className="text-sm text-gray-700">Navigate visa applications with expert help</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-indigo-600 mb-1">Scholarship Tips</p>
            <p className="text-sm text-gray-700">Learn about funding opportunities</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">Select a mentor from the list to start your conversation</p>
      </div>
    </div>
  );
};

export default EmptyConversation;
