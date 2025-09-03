
import React from "react";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import ChatArea from "@/components/messages/ChatArea";
import EmptyConversation from "@/components/messages/EmptyConversation";
import { MessageProvider, useMessageContext } from "@/components/messages/MessageProvider";

const MessagesContent = () => {
  const { 
    selectedMentor, 
    filteredMentors,
    searchQuery,
    message,
    handleSearch,
    handleSelectMentor,
    handleSendMessage,
    setMessage,
    setSelectedMentor
  } = useMessageContext();

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-150px)] bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Sidebar */}
        <div className={`md:w-1/3 ${selectedMentor ? 'hidden md:block' : ''} border-r border-gray-200`}>
          <MessagesSidebar 
            mentors={filteredMentors}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onSelectMentor={handleSelectMentor}
            selectedMentorId={selectedMentor?.id}
          />
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedMentor ? (
            <ChatArea 
              mentor={selectedMentor}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              onBackClick={() => setSelectedMentor(null)}
            />
          ) : (
            <EmptyConversation />
          )}
        </div>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  return (
    <MessageProvider>
      <MessagesContent />
    </MessageProvider>
  );
};

export default MessagesPage;
