"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/app-sidebar';
import { ChatArea } from '@/components/ChatArea';
import api from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';

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


const BACKEND_WEBSOCKET_HOST = 'localhost';


interface MentorSidebarProps {
  mentors: ConnectedMentor[];
  isLoading: boolean;
  selectedChatRoomId: string | null;
  onMentorSelect: (mentor: ConnectedMentor) => void;
}

const MentorSidebar: React.FC<MentorSidebarProps> = ({ mentors, isLoading, selectedChatRoomId, onMentorSelect }) => {
  return (
    <aside className="w-80 bg-white shadow-lg p-6 flex flex-col border-r border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
      {isLoading ? (
        <div className="text-center text-gray-500">Loading mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No connected mentors yet.
          <br />
          Connect with mentors to start chatting!
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto flex-1">
          {mentors.map((mentor) => (
            <li key={mentor.id}>
              <button
                className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ease-in-out
                  ${selectedChatRoomId === mentor.chat_room_id ? 'bg-blue-100 text-blue-800 shadow-md' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'}`}
                onClick={() => onMentorSelect(mentor)}
              >
                {mentor.mentor_info.profile_picture ? (
                  <img
                    src={mentor.mentor_info.profile_picture}
                    alt={mentor.mentor_info.full_name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-gray-300"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/aabbcc/ffffff?text=${mentor.mentor_info.full_name.charAt(0).toUpperCase()}`; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold mr-4">
                    {mentor.mentor_info.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-lg">{mentor.mentor_info.full_name}</p>

                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};


// --- Main Messages Component ---
const Messages = () => {

  const {user} = useSelector((state: RootState) => state.auth);
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
        setConnectedMentors(response.data.results);
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
      console.log('Closing existing WebSocket connection.');
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
        const response = await api.get<Message[]>(
          `/chat/rooms/${selectedChatRoomId}/messages/`,
        );
        const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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

    const WEBSOCKET_URL = `ws://${BACKEND_WEBSOCKET_HOST}/ws/chat/${selectedChatRoomId}/`;
    console.log(`Attempting to connect to WebSocket at: ${WEBSOCKET_URL}`);

    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected successfully!');
      setIsConnected(true);
      setConnectionError('');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message received:', data);

      if (data.type === 'chat_message') {
        const receivedMessage: Message = {
          id: Date.now(),
          content: data.message,
          sender_id: data.sender_id,
          sender_username: data.sender_username,
          timestamp: data.timestamp,
          chat_room_id: data.chat_room_id,
          file_url: data.file_url,
          file_type: data.file_type,
        };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } else if (data.type === 'error') {
        setConnectionError(data.message || 'An unknown error occurred on the server.');
      }
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      setIsConnected(false);
      if (!event.wasClean) {
        setConnectionError('Disconnected. Attempting to reconnect in 3 seconds...');
        setTimeout(() => {
          if (selectedChatRoomId) {
            console.log('Attempting WebSocket reconnect...');
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
        console.log('Cleaning up WebSocket connection.');
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
        console.log('Message sent via WebSocket:', messageData.message);
      }
    } else {
      setConnectionError('Not connected to chat. Please wait or refresh the page.');
      console.warn('Attempted to send message while WebSocket is not open or content is empty.');
    }
  }, []);


  if (!currentUserId) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-100">
        <div className="text-lg text-gray-600">Please log in to view messages. (User ID not found)</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100 font-['Inter']">
        <AppSidebar activeSection="Messages" />

        <div className="flex-1 flex">
          <MentorSidebar
            mentors={connectedMentors}
            isLoading={isLoadingMentors}
            selectedChatRoomId={selectedChatRoomId}
            onMentorSelect={handleMentorSelect}
          />

          <ChatArea
            selectedMentorName={selectedMentorName}
            messages={messages}
            isConnected={isConnected}
            isLoadingHistory={isLoadingHistory}
            connectionError={connectionError}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Messages;