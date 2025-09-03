
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SessionList from "@/components/sessions/SessionList";
import SessionsFilter from "@/components/sessions/SessionsFilter";
import EmptySessionState from "@/components/sessions/EmptySessionState";
import { SessionsProvider, useSessionsProvider } from "@/components/sessions/SessionsProvider";
import SessionDetailsDialog from "@/components/sessions/SessionDetailsDialog";
import MockMeetingView from "@/components/sessions/MockMeetingView";
import { Search } from "lucide-react";

const SessionsContent = () => {
  const { 
    sessions, 
    filteredSessions, 
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    selectedSession,
    showSessionDetails,
    showMockMeeting,
    closeSessionDetails,
    closeMockMeeting,
    joinSession,
    rateMentor
  } = useSessionsProvider();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden border border-blue-100 min-h-[calc(100vh-120px)]">
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Sessions & Bookings</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              
              {/* Filter Dropdown */}
              <SessionsFilter 
                activeFilter={activeFilter} 
                setActiveFilter={setActiveFilter} 
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="mt-6">
            {sessions.length > 0 ? (
              <SessionList sessions={filteredSessions} />
            ) : (
              <EmptySessionState />
            )}
          </div>
        </div>
      </div>

      {/* Session Details Dialog */}
      <SessionDetailsDialog 
        session={selectedSession}
        open={showSessionDetails}
        onClose={closeSessionDetails}
        onJoinSession={() => selectedSession && joinSession(selectedSession.id)}
        onRateMentor={() => selectedSession && rateMentor(selectedSession.id)}
      />

      {/* Mock Meeting View */}
      <MockMeetingView
        session={selectedSession}
        open={showMockMeeting}
        onClose={closeMockMeeting}
      />
    </div>
  );
};

const SessionsPage = () => {
  return (
    <SessionsProvider>
      <SessionsContent />
    </SessionsProvider>
  );
};

export default SessionsPage;
