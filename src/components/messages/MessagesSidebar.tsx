
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Globe } from "lucide-react";
import MentorListItem from "./MentorListItem";
import { Mentor } from "@/hooks/useMessages";

interface MessagesSidebarProps {
  mentors: Mentor[];
  searchQuery: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectMentor: (mentor: Mentor) => void;
  selectedMentorId?: number;
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({
  mentors,
  searchQuery,
  onSearch,
  onSelectMentor,
  selectedMentorId
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-l-lg overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Study Abroad Mentors</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 h-4 w-4" />
          <Input
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={onSearch}
            className="pl-10 border-indigo-100 focus-visible:ring-indigo-500 bg-white shadow-sm"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <GraduationCap className="h-12 w-12 text-indigo-300 mb-3" />
            <p className="text-gray-600 font-medium text-lg">No mentors found</p>
            <p className="text-gray-500 text-sm mt-2">Try a different search term or check back later</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {mentors.map(mentor => (
              <MentorListItem
                key={mentor.id}
                mentor={mentor}
                isSelected={mentor.id === selectedMentorId}
                onSelect={() => onSelectMentor(mentor)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesSidebar;
