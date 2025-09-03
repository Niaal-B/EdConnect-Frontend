
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mentorChats } from "@/components/messages/mockData";

export interface Mentor {
  id: number;
  name: string;
  status: string;
  image: string;
  university: string;
  lastMessage: string;
  unread: number;
  timestamp: Date;
  messages: Message[];
}

export interface Message {
  id: number;
  text: string;
  sender: "student" | "mentor";
  timestamp: Date;
}

export const useMessages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    
    // Clear unread count when selecting a mentor
    const updatedMentors = mentorChats.map(m => 
      m.id === mentor.id ? { ...m, unread: 0 } : m
    );
    // In a real app, we would update state here
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || !selectedMentor) return;
    
    const maxFreeMessages = 10;
    const currentMessageCount = selectedMentor.messages.filter((msg) => msg.sender === "student").length;
    
    if (currentMessageCount >= maxFreeMessages) {
      toast({
        title: "Message limit reached",
        description: "You have reached the limit for free messages with this study abroad mentor. Upgrade for unlimited access.",
        variant: "destructive",
      });
      return;
    }
    
    const newMessage = {
      id: selectedMentor.messages.length + 1,
      text: message,
      sender: "student" as const,
      timestamp: new Date(),
    };
    
    // In a real app, we would update state here
    // and then use WebSockets to send the message to the server
    
    setMessage("");
    toast({
      title: "Message sent",
      description: "Your message has been sent to your study abroad mentor.",
    });
  };
  
  const filteredMentors = mentorChats.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return {
    searchQuery,
    selectedMentor,
    message,
    filteredMentors,
    handleSearch,
    handleSelectMentor,
    handleSendMessage,
    setMessage,
    setSelectedMentor
  };
};
