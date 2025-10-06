"use client"; 

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import api from '@/lib/api'; 
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';

import { ChatArea } from '@/components/ChatArea';
import { StudentSidebar } from '@/components/mentors/StudentSidebar'; 

interface StudentInfo {
  id: number; 
  full_name: string;
  profile_picture?: string | null; 
  email: string;
}

interface ConnectedStudent {
  id: number;
  chat_room_id: string; 
  student_info: StudentInfo;
}

// UPDATED: Added file_url and file_type to match backend API response
interface Message {
  id: number; 
  content: string | null;  // Changed to allow null for file messages
  sender_id: number; 
  sender_username: string;
  timestamp: string; 
  chat_room_id: string; 
  file_url?: string;      // Will be mapped from backend 'file' field
  file_type?: string;     // Matches backend field name
}

const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const BACKEND_WEBSOCKET_HOST = import.meta.env.VITE_BACKEND_WEBSOCKET_HOST;

const MentorMessages = () => {
  const {user } = useSelector((state: RootState) => state.auth);
  const currentUserId = user.id; 

  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]); 
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [connectedStudents, setConnectedStudents] = useState<ConnectedStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const ws = useRef<WebSocket | null>(null); 

  useEffect(() => {
    const loadStudents = async () => {
      if (!currentUserId) {
        setConnectionError('User ID not available. Please ensure you are logged in.');
        setIsLoadingStudents(false);
        return;
      }
      setIsLoadingStudents(true);
      setConnectionError(''); 
      try {
        const response = await api.get<{ results: ConnectedStudent[] }>(`/connections/my-students/`);
        setConnectedStudents(response.data.results);
      } catch (error) {
        console.error('Error fetching students:', error);
        setConnectionError('Failed to load students. Please check your network or try again.');
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudents();
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
        const response = await api.get(`/chat/rooms/${selectedChatRoomId}/messages/`);
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
          file_url: data.file_url,     // Added file support
          file_type: data.file_type,   // Added file support
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

  const handleStudentSelect = (student: ConnectedStudent) => {
    if (selectedChatRoomId !== student.chat_room_id) {
      setSelectedChatRoomId(student.chat_room_id);
      setSelectedStudentName(student.student_info.full_name);
      setMessages([]);
      setConnectionError(''); 
    }
  };

  // UPDATED: This function now matches the student side exactly
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

  if (isLoadingStudents) {
    return (
      <MentorDashboardLayout>
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <div className="text-lg text-gray-600">Loading messages...</div>
        </div>
      </MentorDashboardLayout>
    );
  }

  if (!currentUserId) {
    return (
      <MentorDashboardLayout>
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <div className="text-lg text-gray-600">Please log in to view messages. (User ID not found)</div>
        </div>
      </MentorDashboardLayout>
    );
  }

  return (
    <MentorDashboardLayout>
      <div className="h-screen bg-gray-100 font-['Inter']">
        <div className="flex h-full">
          <StudentSidebar
            students={connectedStudents}
            isLoading={isLoadingStudents}
            selectedChatRoomId={selectedChatRoomId}
            onStudentSelect={handleStudentSelect}
          />

          <ChatArea
            selectedMentorName={selectedStudentName}
            messages={messages}
            isConnected={isConnected}
            isLoadingHistory={isLoadingHistory}
            connectionError={connectionError}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorMessages;