import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, SendIcon, MapPin, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mentor } from "@/hooks/useMessages";

// MODIFIED: onSendMessage now accepts an optional file parameter
interface ChatAreaProps {
  mentor: Mentor;
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: (file?: File) => void;
  onBackClick: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  mentor,
  message,
  onMessageChange,
  onSendMessage,
  onBackClick,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // NEW: Ref for file input
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // NEW: State for the selected file
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [mentor.messages]);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const groupedMessages = mentor.messages.reduce((groups: any, message) => {
    // MODIFIED: Ensure message.timestamp is a Date object
    const date = formatDate(new Date(message.timestamp));
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  const messagesLeft = 10 - mentor.messages.filter(m => m.sender === "student").length;
  
  // NEW: Handle file selection and update the input field
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    // If a file is selected, show its name in the text input
    if (file) {
      onMessageChange(file.name);
    }
  };

  // MODIFIED: Handle sending a message, now includes file logic
  const handleSendMessage = () => {
    if (message.trim() || selectedFile) {
      onSendMessage(selectedFile); // Pass the selected file to the parent component
      setSelectedFile(null); // Clear selected file after sending
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100" 
            onClick={onBackClick}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={mentor.image} alt={mentor.name} />
              <AvatarFallback className="bg-indigo-100 text-indigo-800 font-medium">
                {mentor.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{mentor.name}</h3>
            <div className="flex items-center text-xs text-indigo-600">
              <MapPin className="h-3 w-3 mr-1" /> 
              <span>{mentor.university}</span>
            </div>
          </div>
        </div>
        <div className="rounded-full py-1.5 px-3 bg-gradient-to-r from-indigo-100 to-blue-100 text-xs font-medium text-indigo-700">
          {mentor.status === "online" ? "Online" : "Offline"}
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 px-4 pt-4 pb-2" ref={scrollAreaRef}>
        <div className="space-y-6 pb-4">
          {Object.entries(groupedMessages).map(([date, messages]: [string, any]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "mentor" && (
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <Avatar className="h-8 w-8 border border-gray-100">
                        <AvatarImage src={mentor.image} alt={mentor.name} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xs font-medium">
                          {mentor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm",
                      msg.sender === "student" 
                        ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white" 
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {/* --- NEW CONDITIONAL RENDERING FOR FILES --- */}
                    {msg.file_url && (
                        msg.file_type && msg.file_type.startsWith("image/") ? (
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                                <img 
                                  src={msg.file_url} 
                                  alt="Attached media" 
                                  className="max-w-full h-auto rounded-lg mb-2"
                                />
                            </a>
                        ) : (
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-indigo-600 hover:underline">
                                <Paperclip className="h-4 w-4 mr-2" />
                                <span>Download file</span>
                            </a>
                        )
                    )}
                    
                    {/* Render text content only if it exists */}
                    {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                    
                    <p className={cn(
                      "text-xs mt-1 text-right",
                      msg.sender === "student" ? "text-blue-100" : "text-gray-500"
                    )}>
                      {formatTime(new Date(msg.timestamp))}
                    </p>
                  </div>
                  
                  {msg.sender === "student" && (
                    <div className="w-8 h-8 ml-2" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <div className="p-4 border-t bg-white">
        <form 
          className="flex space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          {/* NEW: Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
          />
          {/* NEW: Button to trigger the file input */}
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-indigo-600"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="flex-1 border-indigo-100 focus-visible:ring-indigo-400"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-md"
            // MODIFIED: Disable button if there's no text or no file
            disabled={!message.trim() && !selectedFile}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="mt-3 flex justify-between items-center px-1">
          <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
            <div 
              className={cn(
                "h-full bg-gradient-to-r from-indigo-500 to-blue-500",
                messagesLeft <= 2 ? "from-red-500 to-orange-500" : ""
              )} 
              style={{ width: `${(10 - messagesLeft) * 10}%` }} 
            />
          </div>
          <span className={cn(
            "text-xs font-medium ml-3",
            messagesLeft <= 2 ? "text-red-500" : "text-indigo-600"
          )}>
            {messagesLeft} free {messagesLeft === 1 ? 'message' : 'messages'} left
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;