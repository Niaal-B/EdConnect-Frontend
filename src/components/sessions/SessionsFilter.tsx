
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface SessionsFilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const SessionsFilter: React.FC<SessionsFilterProps> = ({ activeFilter, setActiveFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const filters = [
    { value: "all", label: "All Sessions" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" }
  ];
  
  const activeLabel = filters.find(f => f.value === activeFilter)?.label || "All Sessions";
  
  const handleFilterSelect = (value: string) => {
    setActiveFilter(value);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto bg-white border-gray-200 text-gray-700 justify-between"
      >
        {activeLabel}
        <ArrowDown className="ml-2 h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilterSelect(filter.value)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  activeFilter === filter.value 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsFilter;
