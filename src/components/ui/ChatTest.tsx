import React, { useState, useEffect, useRef, FormEvent } from 'react';

// Define a type for a chat message, matching what your backend sends
interface ChatMessage {
  type: string;
  message: string;
  sender_id: number;
  sender_username: string;
  timestamp: string; // ISO 8601 string
  chat_room_id: string;
}

// Props for the ChatTest component
interface ChatTestProps {
  // You'll need to pass the chat room ID to this component.
  // For testing, you can hardcode it or get it from a URL parameter.
  chatRoomId: string; 
  // You might also need the current user's ID to style messages differently
  currentUserId: number; 
}

const ChatTest: React.FC<ChatTestProps> = ({ chatRoomId, currentUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const ws = useRef<WebSocket | null>(null); // Ref to hold the WebSocket instance
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Base URL for your backend (assuming Nginx is on localhost:80)
  // Adjust this if your Nginx is on a different domain/port
  const WS_BASE_URL = `ws://localhost/ws/chat/${chatRoomId}/`;

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket(WS_BASE_URL);

    // WebSocket event listeners
    ws.current.onopen = () => {
      console.log('WebSocket connection opened:', WS_BASE_URL);
      // You could send an initial message or fetch history here
    };

    ws.current.onmessage = (event) => {
      // Parse the incoming JSON message
      const receivedMessage: ChatMessage = JSON.parse(event.data);
      console.log('Message received:', receivedMessage);

      // Add the new message to the state
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      // Handle different close codes (e.g., 4001 for auth failure)
      if (event.code === 4001) {
        alert('Authentication failed. Please log in.');
      } else if (event.code === 4003) {
        alert('Authorization failed. You are not allowed in this chat room.');
      } else if (event.code === 4004) {
        alert('Chat room not found.');
      }
      // Implement reconnect logic if needed
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup function: Close WebSocket when component unmounts
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
        console.log('WebSocket connection closed on unmount.');
      }
    };
  }, [chatRoomId]); // Re-run effect if chatRoomId changes

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (inputMessage.trim() === '') return; // Don't send empty messages

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // Send message as a JSON string
      ws.current.send(JSON.stringify({ message: inputMessage }));
      setInputMessage(''); // Clear input field
    } else {
      console.warn('WebSocket is not open. Message not sent.');
      // Optionally, show a user-friendly message
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden font-inter">
      <div className="p-4 bg-blue-600 text-white text-xl font-semibold rounded-t-lg">
        Chat Room: {chatRoomId}
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet. Start chatting!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                  msg.sender_id === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="font-bold text-sm">
                  {msg.sender_id === currentUserId ? 'You' : msg.sender_username}
                </div>
                <p className="text-base">{msg.message}</p>
                <div className="text-xs text-right mt-1 opacity-80">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatTest;