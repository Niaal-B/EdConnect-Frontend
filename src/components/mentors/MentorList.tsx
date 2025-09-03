
import React from "react";
import { GraduationCap } from "lucide-react";
import MentorCard from "./MentorCard";

interface MentorListProps {
  mentors: any[];
  onViewProfile: (mentor: any) => void;
  onOpenChat: (mentor: any) => void;
  onBookSession: (mentor: any) => void;
}

const MentorList: React.FC<MentorListProps> = ({
  mentors,
  onViewProfile,
  onOpenChat,
  onBookSession,
}) => {
  if (mentors.length === 0) {
    return (
      <div className="text-center py-16">
        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">No mentors found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <MentorCard
          key={mentor.id}
          mentor={mentor}
          onViewProfile={onViewProfile}
          onOpenChat={onOpenChat}
          onBookSession={onBookSession}
        />
      ))}
    </div>
  );
};

export default MentorList;
