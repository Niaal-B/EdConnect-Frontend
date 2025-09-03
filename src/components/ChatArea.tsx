import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ChatAreaProps {
  selectedMentorName: string;
  messages: Message[];
  isConnected: boolean;
  isLoadingHistory: boolean;
  connectionError: string;
  currentUserId: number;
  onSendMessage: (content: string, file?: File) => void;
}

export function ChatArea({
  selectedMentorName,
  messages,
  isConnected,
  isLoadingHistory,
  connectionError,
  currentUserId,
  onSendMessage
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setInputValue('');
    setSelectedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedMentorName]);

  const handleSend = () => {
    if ((inputValue.trim() || selectedFile) && isConnected) {
      onSendMessage(inputValue, selectedFile || undefined);
      setInputValue('');
      setSelectedFile(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setInputValue(file.name);
      if (textareaRef.current) {
        adjustTextareaHeight(textareaRef.current);
      }
    } else {
      setInputValue('');
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

  if (!selectedMentorName) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a mentor to start chatting</h3>
          <p className="text-sm text-gray-500">Your conversations will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Chat with {selectedMentorName}
            </h2>
            {isLoadingHistory && (
              <p className="text-sm text-gray-500">Loading history...</p>
            )}
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {connectionError && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {connectionError}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-white rounded-lg shadow-inner m-4">
        {messages.length === 0 && !isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
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
                      <AvatarFallback className={`text-xs ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {isOwn ? 'Y' : message.sender_username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {isOwn ? 'You' : message.sender_username}
                      </div>
                      <div
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm break-words',
                          isOwn
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        )}
                      >
                        {message.file_url ? (
                          message.file_type && message.file_type.startsWith('image/') ? (
                            <a href={message.file_url} target="_blank" rel="noopener noreferrer">
                              <img 
                                src={message.file_url} 
                                alt="Attached media" 
                                className="max-w-full h-auto rounded-lg mb-2"
                              />
                            </a>
                          ) : (
                            <a href={message.file_url} target="_blank" rel="noopener noreferrer" className={cn(
                              'flex items-center',
                              isOwn ? 'text-white hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
                            )}>
                              <Paperclip className="h-4 w-4 mr-2" />
                              <span>Download file</span>
                            </a>
                          )
                        ) : null}

                        {message.content && <div className="mt-1">{message.content}</div>}

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

      <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex items-end m-4 gap-3">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected}
          className="text-gray-500 hover:text-blue-600"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={selectedFile ? selectedFile.name : 'Type your message...'}
          disabled={!isConnected}
          className="flex-1 resize-none min-h-[44px] max-h-[120px] overflow-y-auto"
        />
        <Button
          onClick={handleSend}
          disabled={!isConnected || (!inputValue.trim() && !selectedFile)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition transform hover:scale-105 self-end"
        >
          Send
        </Button>
      </div>
    </div>
  );
}