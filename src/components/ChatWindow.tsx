
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, SendIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "student" | "mentor";
  timestamp: Date;
}

interface ChatWindowProps {
  mentor: {
    id: number;
    name: string;
    image: string;
  };
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ mentor, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm ${mentor.name}. How can I help you today?`,
      sender: "mentor",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ]);
  const [freeMessagesUsed, setFreeMessagesUsed] = useState<number>(1);
  const FREE_MESSAGE_LIMIT = 10;
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (freeMessagesUsed >= FREE_MESSAGE_LIMIT) {
      toast({
        title: "Free message limit reached",
        description: "Book a session to continue chatting with this mentor.",
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "student",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setFreeMessagesUsed(prev => prev + 1);

    // Simulate mentor response after a short delay
    if (freeMessagesUsed < FREE_MESSAGE_LIMIT - 1) {
      setTimeout(() => {
        const mentorReply: Message = {
          id: messages.length + 2,
          text: `Thanks for your message. I'd be happy to discuss this further during our next session.`,
          sender: "mentor",
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, mentorReply]);
        setFreeMessagesUsed(prev => prev + 1);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mentor.image} alt={mentor.name} />
            <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{mentor.name}</h3>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Message counter */}
      <div className="bg-muted/20 px-4 py-1 text-xs text-center">
        <span className={freeMessagesUsed >= FREE_MESSAGE_LIMIT ? "text-destructive" : ""}>
          {freeMessagesUsed}/{FREE_MESSAGE_LIMIT} free messages used
        </span>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.sender === "student"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1 text-right">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t">
        {freeMessagesUsed >= FREE_MESSAGE_LIMIT ? (
          <div className="text-center py-2">
            <p className="text-sm text-destructive mb-2">
              You've reached your free message limit
            </p>
            <Button size="sm">Book a Session to Continue</Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button type="submit" size="icon" onClick={handleSendMessage}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
