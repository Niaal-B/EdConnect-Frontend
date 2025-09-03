import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_username: string;
  timestamp: string;
  chat_room_id: string;
}

interface ChatAreaProps {
  selectedStudentName: string; // Renamed from selectedMentorName for mentor's view
  messages: Message[];
  isConnected: boolean;
  isLoadingHistory: boolean;
  connectionError: string;
  currentUserId: number;
  onSendMessage: (content: string) => void;
}

export function ChatArea({
  selectedStudentName, // Renamed prop
  messages,
  isConnected,
  isLoadingHistory,
  connectionError,
  currentUserId,
  onSendMessage
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    console.log(messages,"This is message")
    console.log(currentUserId)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset input and textarea height when a new chat is selected
  useEffect(() => {
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [selectedStudentName]); // Reset when selected student changes

  const handleSend = () => {
    if (inputValue.trim() && isConnected) {
      onSendMessage(inputValue);
      setInputValue('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustTextareaHeight(e.target);
  };

  if (!selectedStudentName) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <MessageCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a student to start chatting</h3>
          <p className="text-sm text-gray-500">Your conversations will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Chat with {selectedStudentName}
            </h2>
            {isLoadingHistory && (
              <p className="text-sm text-gray-500">Loading history...</p>
            )}
          </div>
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      {/* Error Display */}
      {connectionError && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {connectionError}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-white">
        {messages.length === 0 && !isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-xs md:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className={`h-8 w-8 ${isOwn ? 'ml-2' : 'mr-2'}`}>
                      {/* You'll need to pass student profile picture URL via props if available */}
                      {/* For now, fallback to initial */}
                      <AvatarFallback className={`text-xs ${isOwn ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                        {isOwn ? 'Y' : message.sender_username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {isOwn ? 'You' : message.sender_username}
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg text-sm break-words ${
                          isOwn
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {message.content}
                        <div className={`text-right text-xs mt-1 opacity-70`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input Area */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex items-end m-4 gap-3">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isConnected}
          className="flex-1 resize-none min-h-[44px] max-h-[120px] overflow-y-auto"
        />
        <Button
          onClick={handleSend}
          disabled={!isConnected || !inputValue.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition transform hover:scale-105 self-end"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
