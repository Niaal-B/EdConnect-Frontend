
import React, { createContext, useContext } from "react";
import { useMessages, Mentor, Message } from "@/hooks/useMessages";

interface MessageContextType {
  searchQuery: string;
  selectedMentor: Mentor | null;
  message: string;
  filteredMentors: Mentor[];
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectMentor: (mentor: Mentor) => void;
  handleSendMessage: () => void;
  setMessage: (value: string) => void;
  setSelectedMentor: (mentor: Mentor | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const messageState = useMessages();
  
  return (
    <MessageContext.Provider value={messageState as MessageContextType}>
      {children}
    </MessageContext.Provider>
  );
};
