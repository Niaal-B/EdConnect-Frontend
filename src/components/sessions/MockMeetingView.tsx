
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users, Share } from "lucide-react";
import { Session } from "./SessionsProvider";

interface MockMeetingViewProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
}

const MockMeetingView: React.FC<MockMeetingViewProps> = ({
  session,
  open,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simulate a timer for the meeting
  useEffect(() => {
    let timer: number;
    if (open) {
      timer = window.setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [open]);

  // Format the elapsed time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 h-[80vh] max-h-[700px]">
        {/* Meeting Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <h3 className="font-medium">Live Meeting • {formatTime(elapsedTime)}</h3>
          </div>
          <div className="text-sm">
            Session with {session.mentorName}
          </div>
        </div>
        
        {/* Meeting Content */}
        <div className="flex flex-col h-full bg-gray-900 text-white">
          {/* Video Area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-gray-900">
            {/* Mentor Video */}
            <div className="relative rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
              <div className="absolute top-3 left-3 bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm">
                {session.mentorName}
              </div>
              <Avatar className="h-32 w-32 opacity-90">
                <AvatarImage src={session.mentorImage} alt={session.mentorName} />
                <AvatarFallback>{session.mentorName.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            
            {/* User Video */}
            <div className="relative rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
              <div className="absolute top-3 left-3 bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm">
                You
              </div>
              {isVideoOn ? (
                <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                  <Avatar className="h-32 w-32 opacity-90">
                    <AvatarFallback>YOU</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Avatar className="h-24 w-24 opacity-80">
                    <AvatarFallback>YOU</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300">Camera Off</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="p-4 bg-gray-800 flex justify-center gap-3">
            <Button
              variant="outline"
              className={`rounded-full p-3 h-12 w-12 ${isMuted ? 'bg-red-600 hover:bg-red-700 text-white border-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            
            <Button
              variant="outline"
              className={`rounded-full p-3 h-12 w-12 ${!isVideoOn ? 'bg-red-600 hover:bg-red-700 text-white border-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </Button>
            
            <Button
              variant="outline"
              className="rounded-full p-3 h-12 w-12 bg-gray-700 hover:bg-gray-600"
            >
              <MessageSquare size={20} />
            </Button>
            
            <Button
              variant="outline"
              className="rounded-full p-3 h-12 w-12 bg-gray-700 hover:bg-gray-600"
            >
              <Share size={20} />
            </Button>
            
            <Button
              variant="outline"
              className="rounded-full p-3 h-12 w-12 bg-gray-700 hover:bg-gray-600"
            >
              <Users size={20} />
            </Button>
            
            <Button
              className="rounded-full p-3 h-12 w-12 bg-red-600 hover:bg-red-700 ml-4"
              onClick={onClose}
            >
              <Phone size={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockMeetingView;
