"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatArea } from '@/components/ChatArea';
import api from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { Search, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MentorInfo {
  id: number;
  full_name: string;
  profile_picture?: string | null;
  email: string;
  bio?: string;
  expertise?: string;
  slots?: any[];
}

interface ConnectedMentor {
  id: number;
  chat_room_id: string;
  mentor_info: MentorInfo;

}

interface Message {
  id: number;
  content: string | null;
  sender_id: number;
  sender_username: string;
  timestamp: string;
  chat_room_id: string;
  file_url?: string;
  file_type?: string;
}

const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";


const BACKEND_WEBSOCKET_HOST = import.meta.env.VITE_BACKEND_WEBSOCKET_HOST;



interface MentorSidebarProps {
  mentors: ConnectedMentor[];
  isLoading: boolean;
  selectedChatRoomId: string | null;
  onMentorSelect: (mentor: ConnectedMentor) => void;
}

const MentorSidebar: React.FC<MentorSidebarProps> = ({ mentors, isLoading, selectedChatRoomId, onMentorSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMentors = mentors.filter(m => 
    m.mentor_info.full_name.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search mentors..."
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
            <span className="text-sm font-medium text-gray-400 tracking-wide">Loading mentors...</span>
          </div>
        ) : mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold mb-1">No Mentors Connected</p>
              <p className="text-sm text-gray-500 max-w-[200px]">Connect with mentors to start chatting here.</p>
            </div>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm font-medium">
            No mentors found matching "{searchQuery}"
          </div>
        ) : (
          <ul className="space-y-1.5 w-full pb-4">
            {filteredMentors.map((mentor) => {
              const isSelected = selectedChatRoomId === mentor.chat_room_id;
              return (
                <li key={mentor.id} className="w-full px-1">
                  <button
                    className={cn(
                      "flex items-center w-full p-3.5 rounded-xl transition-all duration-300 ease-in-out group relative",
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-sm ring-1 ring-blue-100/50' 
                        : 'bg-transparent hover:bg-gray-50/80 hover:shadow-sm'
                    )}
                    onClick={() => onMentorSelect(mentor)}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    )}
                    
                    <Avatar className="h-12 w-12 shadow-sm ring-2 ring-white transition-transform duration-300 group-hover:scale-105 shrink-0">
                      <AvatarImage 
                        src={mentor.mentor_info.profile_picture || undefined} 
                        alt={mentor.mentor_info.full_name} 
                        className="object-cover"
                      />
                      <AvatarFallback className={cn(
                        "font-semibold text-white",
                        isSelected ? "bg-gradient-to-br from-blue-600 to-indigo-600" : "bg-gradient-to-br from-gray-400 to-gray-500"
                      )}>
                        {mentor.mentor_info.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="ml-3.5 flex-1 text-left min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between w-full mb-0.5">
                        <p className={cn(
                          "font-bold truncate text-[15px] pt-1",
                          isSelected ? "text-blue-900" : "text-gray-800"
                        )}>
                          {mentor.mentor_info.full_name}
                        </p>
                      </div>
                      <p className="text-[13px] text-gray-500 truncate font-medium max-w-[180px]">
                        {mentor.mentor_info.expertise || "General Mentor"}
                      </p>
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


// --- Main Messages Component ---
const Messages = () => {

  const { user } = useSelector((state: RootState) => state.auth);
  const currentUserId = user.id;

  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [selectedMentorName, setSelectedMentorName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [connectedMentors, setConnectedMentors] = useState<ConnectedMentor[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const loadMentors = async () => {
      if (!currentUserId) {
        setConnectionError('User ID not available. Please ensure you are logged in.');
        setIsLoadingMentors(false);
        return;
      }
      setIsLoadingMentors(true);
      setConnectionError('');
      try {
        const response = await api.get<ConnectedMentor[]>(
          `/connections/my-mentors/`);
        setConnectedMentors((response.data as any).results);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setConnectionError('Failed to load mentors. Please check your network or try again.');
      } finally {
        setIsLoadingMentors(false);
      }
    };

    loadMentors();
  }, [currentUserId]);

  useEffect(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setIsConnected(false);
    }

    if (!selectedChatRoomId) {
      setMessages([]);
      setConnectionError('');
      return;
    }

    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      setConnectionError('');
      try {
        const response = await api.get(`/chat/rooms/${selectedChatRoomId}/messages/`);
        // FIXED: Map backend field names to frontend interface
        const mappedMessages = response.data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          sender_username: msg.sender_username,
          timestamp: msg.timestamp,
          chat_room_id: msg.chat_room || selectedChatRoomId, // Use chat_room or fallback
          file_url: msg.file,        // Map 'file' to 'file_url'
          file_type: msg.file_type,  // This one matches
        }));
        const sortedMessages = mappedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setConnectionError('Failed to load chat history. Please try again.');
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();

    const WEBSOCKET_URL = `${wsProtocol}//${BACKEND_WEBSOCKET_HOST}/ws/chat/${selectedChatRoomId}/`;

    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      setIsConnected(true);
      setConnectionError('');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'chat_message') {
        const receivedMessage: Message = {
          id: Date.now(),
          content: data.message,
          sender_id: data.sender_id,
          sender_username: data.sender_username,
          timestamp: data.timestamp,
          chat_room_id: data.chat_room_id,
          file_url: data.file_url || data.file,  // FIXED: Handle both field names
          file_type: data.file_type,
        };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } else if (data.type === 'error') {
        setConnectionError(data.message || 'An unknown error occurred on the server.');
      }
    };

    ws.current.onclose = (event) => {
      setIsConnected(false);
      if (!event.wasClean) {
        setConnectionError('Disconnected. Attempting to reconnect in 3 seconds...');
        setTimeout(() => {
          if (selectedChatRoomId) {
          }
        }, 3000);
      } else {
        setConnectionError('Disconnected.');
      }
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnectionError('WebSocket error. Check console for details. Attempting to reconnect...');
      ws.current?.close();
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [selectedChatRoomId, currentUserId]);

  const handleMentorSelect = (mentor: ConnectedMentor) => {
    if (selectedChatRoomId !== mentor.chat_room_id) {
      setSelectedChatRoomId(mentor.chat_room_id);
      setSelectedMentorName(mentor.mentor_info.full_name);
      setMessages([]);
      setConnectionError('');
    }
  };

  // UPDATED: This function now accepts both a content string and an optional file
  const handleSendMessage = useCallback((content: string, file?: File) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      if (file) {
        // Handle file message
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result as string;
          const messagePayload = {
            message: content, // This will be the file name
            file_data: fileData,
            file_name: file.name,
            file_type: file.type,
          };
          ws.current?.send(JSON.stringify(messagePayload));
        };
        reader.readAsDataURL(file);
      } else if (content.trim()) {
        // Handle regular text message
        const messageData = {
          message: content.trim(),
        };
        ws.current.send(JSON.stringify(messageData));
      }
    } else {
      setConnectionError('Not connected to chat. Please wait or refresh the page.');
      console.warn('Attempted to send message while WebSocket is not open or content is empty.');
    }
  }, []);


  if (!currentUserId) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)] w-full bg-gray-50/50 rounded-2xl">
        <div className="text-lg text-gray-600">Please log in to view messages. (User ID not found)</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/60 overflow-hidden flex h-full">
        <MentorSidebar
          mentors={connectedMentors}
          isLoading={isLoadingMentors}
          selectedChatRoomId={selectedChatRoomId}
          onMentorSelect={handleMentorSelect}
        />

        <div className={cn(
          "flex-1 flex flex-col min-w-0 bg-[#F8FAFC]",
          !selectedChatRoomId && "hidden md:flex"
        )}>
          <ChatArea
            selectedMentorName={selectedMentorName}
            messages={messages}
            isConnected={isConnected}
            isLoadingHistory={isLoadingHistory}
            connectionError={connectionError}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedChatRoomId(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;