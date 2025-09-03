
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Mentor } from "@/hooks/useMessages";

interface MentorListItemProps {
  mentor: Mentor;
  isSelected: boolean;
  onSelect: () => void;
}

const MentorListItem: React.FC<MentorListItemProps> = ({
  mentor,
  isSelected,
  onSelect
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'just now';
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-center p-4 hover:bg-indigo-50/70 cursor-pointer transition-colors",
        isSelected && "bg-indigo-100/80 border-r-4 border-indigo-500"
      )}
      onClick={onSelect}
    >
      <div className="relative">
        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
          <AvatarImage src={mentor.image} alt={mentor.name} />
          <AvatarFallback className="bg-indigo-100 text-indigo-800 font-medium">
            {mentor.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div 
          className={cn(
            "absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white",
            mentor.status === "online" ? "bg-green-500" : "bg-gray-400"
          )}
        />
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-800 truncate">{mentor.name}</h4>
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-2">
            {formatTime(mentor.timestamp)}
          </span>
        </div>
        
        <p className="text-xs text-indigo-600 font-medium mt-0.5">{mentor.university}</p>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 truncate max-w-[180px]">
            {mentor.lastMessage}
          </p>
          {mentor.unread > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-bold ml-2">
              {mentor.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorListItem;
