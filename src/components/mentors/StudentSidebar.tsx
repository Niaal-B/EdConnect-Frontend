import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  return (
    <aside className="w-80 bg-white shadow-lg p-6 flex flex-col border-r border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
      {isLoading ? (
        <div className="text-center text-gray-500">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No connected students yet.
          <br />
          Accept connection requests to start chatting!
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto flex-1">
          {students.map((student) => (
            <li key={student.id}>
              <button
                className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ease-in-out
                  ${selectedChatRoomId === student.chat_room_id ? 'bg-green-100 text-green-800 shadow-md' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'}`}
                onClick={() => onStudentSelect(student)}
              >
                {student.student_info.profile_picture ? (
                  <Avatar className="w-12 h-12 mr-4 border-2 border-gray-300">
                    <AvatarImage
                      src={student.student_info.profile_picture}
                      alt={student.student_info.full_name}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/48x48/10b981/ffffff?text=${student.student_info.full_name.charAt(0).toUpperCase()}`;
                      }}
                    />
                    <AvatarFallback className="text-xs bg-green-500 text-white">
                      {student.student_info.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl font-semibold mr-4">
                    {student.student_info.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-lg">{student.student_info.full_name}</p>
                  {/* Optional: Add last message preview here if your API provides it */}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};
