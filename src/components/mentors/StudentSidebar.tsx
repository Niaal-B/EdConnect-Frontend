import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentInfo {
  id: number;
  full_name: string;
  profile_picture?: string | null;
  email: string;
}

interface ConnectedStudent {
  id: number; // Connection ID from Django
  chat_room_id: string; // UUID string from ChatRoom model
  student_info: StudentInfo;
}

interface StudentSidebarProps {
  students: ConnectedStudent[];
  isLoading: boolean;
  selectedChatRoomId: string | null;
  onStudentSelect: (student: ConnectedStudent) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  students,
  isLoading,
  selectedChatRoomId,
  onStudentSelect
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(s => 
    s.student_info.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={cn(
      "bg-white flex flex-col border-r border-gray-100/80 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-10 h-full rounded-l-2xl overflow-hidden",
      selectedChatRoomId ? "hidden md:flex md:w-[320px]" : "flex w-full md:w-[320px]"
    )}>
      <div className="p-5 border-b border-gray-100 bg-white/60 backdrop-blur-xl z-10 sticky top-0">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-5 tracking-tight">Messages</h2>
        <div className="relative group">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-3 space-y-1.5 scroll-smooth">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            <span className="text-sm font-medium text-gray-400 tracking-wide">Loading students...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold mb-1">No Students Connected</p>
              <p className="text-sm text-gray-500 max-w-[200px]">Accept connection requests to start chatting here.</p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm font-medium">
            No students found matching "{searchQuery}"
          </div>
        ) : (
          <ul className="space-y-1.5 w-full pb-4">
            {filteredStudents.map((student) => {
              const isSelected = selectedChatRoomId === student.chat_room_id;
              return (
                <li key={student.id} className="w-full px-1">
                  <button
                    className={cn(
                      "flex items-center w-full p-3.5 rounded-xl transition-all duration-300 ease-in-out group relative",
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-sm ring-1 ring-blue-100/50' 
                        : 'bg-transparent hover:bg-gray-50/80 hover:shadow-sm'
                    )}
                    onClick={() => onStudentSelect(student)}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    )}
                    
                    <Avatar className="h-12 w-12 shadow-sm ring-2 ring-white transition-transform duration-300 group-hover:scale-105 shrink-0">
                      <AvatarImage 
                        src={student.student_info.profile_picture || undefined} 
                        alt={student.student_info.full_name} 
                        className="object-cover"
                      />
                      <AvatarFallback className={cn(
                        "font-semibold text-white",
                        isSelected ? "bg-gradient-to-br from-blue-600 to-indigo-600" : "bg-gradient-to-br from-gray-400 to-gray-500"
                      )}>
                        {student.student_info.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="ml-3.5 flex-1 text-left min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between w-full mb-0.5">
                        <p className={cn(
                          "font-bold truncate text-[15px] pt-1",
                          isSelected ? "text-blue-900" : "text-gray-800"
                        )}>
                          {student.student_info.full_name}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};
