
import React, { createContext, useContext, useState, useMemo } from "react";
import { mockSessions } from "./mockSessionsData";
import { useNavigate } from "react-router-dom";

export type SessionStatus = "upcoming" | "completed" | "canceled";

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  mentorImage: string;
  date: Date;
  time: string;
  duration: string; 
  status: SessionStatus;
  topic?: string;
  notes?: string;
}

interface SessionsContextType {
  sessions: Session[];
  filteredSessions: Session[];
  activeFilter: string;
  searchQuery: string;
  selectedSession: Session | null;
  showSessionDetails: boolean;
  showMockMeeting: boolean;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  joinSession: (sessionId: string) => void;
  rateMentor: (sessionId: string) => void;
  viewSessionDetails: (sessionId: string) => void;
  closeSessionDetails: () => void;
  closeMockMeeting: () => void;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export const useSessionsProvider = () => {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error("useSessionsProvider must be used within a SessionsProvider");
  }
  return context;
};

export const SessionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions] = useState<Session[]>(mockSessions);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [showMockMeeting, setShowMockMeeting] = useState(false);
  
  const filteredSessions = useMemo(() => {
    return sessions
      .filter(session => {
        if (activeFilter === "all") return true;
        return session.status === activeFilter;
      })
      .filter(session => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          session.mentorName.toLowerCase().includes(query) ||
          new Date(session.date).toLocaleDateString().includes(query) ||
          session.topic?.toLowerCase().includes(query)
        );
      });
  }, [sessions, activeFilter, searchQuery]);
  
  const joinSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setShowMockMeeting(true);
    }
  };
  
  const rateMentor = (sessionId: string) => {
    console.log(`Rating mentor for session: ${sessionId}`);
    // Implementation would open rating modal or navigate to rating page
  };
  
  const viewSessionDetails = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setShowSessionDetails(true);
    }
  };
  
  const closeSessionDetails = () => {
    setShowSessionDetails(false);
  };
  
  const closeMockMeeting = () => {
    setShowMockMeeting(false);
  };

  const value = {
    sessions,
    filteredSessions,
    activeFilter,
    searchQuery,
    selectedSession,
    showSessionDetails,
    showMockMeeting,
    setActiveFilter,
    setSearchQuery,
    joinSession,
    rateMentor,
    viewSessionDetails,
    closeSessionDetails,
    closeMockMeeting
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
};
