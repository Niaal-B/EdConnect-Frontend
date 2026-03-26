import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Paperclip, Send, MessageCircle } from 'lucide-react';
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

  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(msg => {
      const date = new Date(msg.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      if (date.toDateString() === today.toDateString()) {
        dateStr = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateStr = 'Yesterday';
      }
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(msg);
    });
    return groups;
  }, [messages]);

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
      <div className="flex-1 flex items-center justify-center bg-gray-50/50">
        <div className="text-center max-w-md mx-auto p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center shadow-inner">
            <MessageCircle className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
          <p className="text-sm text-gray-500">Choose a contact from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] relative h-full max-h-screen">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm p-4 px-6 border-b border-gray-100 z-10 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 ring-2 ring-blue-50/50 shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                {selectedMentorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {selectedMentorName}
              </h2>
              <div className="flex items-center mt-0.5">
                <div className={`w-2 h-2 rounded-full mr-1.5 ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                <span className={`text-[13px] font-medium tracking-wide ${isConnected ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isConnected ? 'Online' : 'Offline'}
                </span>
                {isLoadingHistory && (
                  <span className="text-[13px] text-gray-400 ml-3 italic">Loading history...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {connectionError && (
        <Alert className="mx-6 mt-4 border-rose-200 bg-rose-50/80 backdrop-blur-sm text-rose-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertDescription className="font-medium">
            {connectionError}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
        {messages.length === 0 && !isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 mx-auto mb-5 bg-blue-50/50 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-blue-300" />
              </div>
              <p className="text-gray-500 font-medium tracking-wide">Say hello to {selectedMentorName}! 👋</p>
            </div>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-6">
                <div className="flex justify-center my-6 sticky top-2 z-10">
                  <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md text-xs text-gray-500 rounded-full font-medium tracking-wider shadow-sm border border-gray-100 uppercase">
                    {date}
                  </span>
                </div>
                {dateMessages.map((message) => {
                  const isOwn = message.sender_id === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className={`flex items-end max-w-[80%] md:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isOwn && (
                          <Avatar className={`h-8 w-8 mb-1 mr-3 shrink-0 shadow-sm`}>
                            <AvatarFallback className={`text-xs bg-gradient-to-br from-indigo-500 to-blue-600 text-white`}>
                              {message.sender_username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                          {!isOwn && (
                            <div className="text-[12px] text-gray-500 font-medium mb-1.5 ml-1">
                              {message.sender_username}
                            </div>
                          )}
                          <div
                            className={cn(
                              'px-5 py-3 rounded-2xl text-[15px] leading-relaxed break-words shadow-sm transition-all relative group',
                              isOwn
                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-500/10'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-gray-200/20'
                            )}
                          >
                            {message.file_url ? (
                              message.file_type && message.file_type.startsWith('image/') ? (
                                <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg mb-2">
                                  <img 
                                    src={message.file_url} 
                                    alt="Attached media" 
                                    className="max-w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </a>
                              ) : (
                                <a href={message.file_url} target="_blank" rel="noopener noreferrer" className={cn(
                                  'flex items-center p-3 rounded-xl mb-2 transition-colors',
                                  isOwn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-blue-600'
                                )}>
                                  <div className={cn("p-2 rounded-lg mr-3 shadow-sm", isOwn ? 'bg-white/20' : 'bg-blue-100')}>
                                    <Paperclip className={cn("h-4 w-4", isOwn ? 'text-white' : 'text-blue-600')} />
                                  </div>
                                  <span className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">Download Attachment</span>
                                </a>
                              )
                            ) : null}

                            {message.content && <div>{message.content}</div>}

                            <div className={`text-right text-[11px] mt-1.5 font-medium flex items-center justify-end gap-1 ${isOwn ? 'text-blue-100/90' : 'text-gray-400'}`}>
                              {formatTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} className="h-1" />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-transparent p-4 md:px-6 md:pb-6 z-10 w-full">
        <div className="bg-white rounded-[2rem] shadow-lg shadow-gray-200/40 p-1.5 flex items-end gap-2 border border-gray-100/80 transition-shadow focus-within:shadow-xl focus-within:shadow-blue-500/5 focus-within:border-blue-200 w-full mx-auto backdrop-blur-xl">
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
            className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full h-[46px] w-[46px] shrink-0 transition-all duration-200 mb-0.5 ml-1"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center min-h-[50px] bg-transparent">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={selectedFile ? selectedFile.name : 'Write a message...'}
              disabled={!isConnected}
              className="flex-1 resize-none bg-transparent border-0 focus-visible:ring-0 shadow-none min-h-[24px] max-h-[150px] py-3.5 px-2 text-[15px] text-gray-700 placeholder:text-gray-400 leading-relaxed disabled:opacity-50"
              style={{ overflow: 'hidden' }} // To hide scrollbar unless very tall
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!isConnected || (!inputValue.trim() && !selectedFile)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full h-[46px] w-[46px] shrink-0 shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none mb-0.5 mr-1 p-0 flex items-center justify-center group"
          >
            <Send className="h-[18px] w-[18px] ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Button>
        </div>
        {selectedFile && (
          <div className="mt-2 ml-4 flex items-center text-xs font-medium text-blue-600 bg-blue-50 w-fit px-3 py-1.5 rounded-full border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
            <Paperclip className="h-3 w-3 mr-1.5" />
            Attached: {selectedFile.name}
            <button 
              onClick={() => { setSelectedFile(null); setInputValue(''); }}
              className="ml-2 text-rose-500 hover:text-rose-700 font-bold"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}