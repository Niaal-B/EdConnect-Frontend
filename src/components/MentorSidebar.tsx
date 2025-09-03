
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface MentorInfo {
  id: number;
  full_name: string;
  profile_picture?: string;
  email: string;
}

interface ConnectedMentor {
  id: number;
  chat_room_id: string;
  mentor_info: MentorInfo;
  last_message_content?: string;
  last_message_timestamp?: string;
}

interface MentorSidebarProps {
  mentors: ConnectedMentor[];
  isLoading: boolean;
  selectedChatRoomId: string | null;
  onMentorSelect: (mentor: ConnectedMentor) => void;
}

export function MentorSidebar({ 
  mentors, 
  isLoading, 
  selectedChatRoomId, 
  onMentorSelect 
}: MentorSidebarProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                No connected mentors yet. Connect with mentors to start chatting!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {mentors.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => onMentorSelect(mentor)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
                  selectedChatRoomId === mentor.chat_room_id
                    ? 'bg-blue-100 text-blue-800 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0 mr-4">
                  <Avatar className="h-12 w-12 border-2 border-gray-300">
                    <AvatarImage src={mentor.mentor_info.profile_picture} />
                    <AvatarFallback className="bg-blue-500 text-white text-xl font-semibold">
                      {getInitials(mentor.mentor_info.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-semibold text-lg text-gray-900 truncate">
                    {mentor.mentor_info.full_name}
                  </div>
                  
                  {mentor.last_message_content && (
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {mentor.last_message_content}
                      </p>
                      {mentor.last_message_timestamp && (
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatTimestamp(mentor.last_message_timestamp)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
