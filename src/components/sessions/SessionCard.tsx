
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Check, X, ChevronRight, Star } from "lucide-react";
import { Session, useSessionsProvider } from "./SessionsProvider";

interface SessionCardProps {
  session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { joinSession, rateMentor, viewSessionDetails } = useSessionsProvider();
  
  const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  const getStatusBadge = () => {
    switch(session.status) {
      case "upcoming":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Upcoming</span>;
      case "completed":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Completed</span>;
      case "canceled":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Canceled</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch(session.status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "canceled":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border border-gray-100">
      <CardContent className="p-0">
        {/* Card Header with Mentor Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-blue-100">
              <AvatarImage src={session.mentorImage} alt={session.mentorName} />
              <AvatarFallback>{session.mentorName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{session.mentorName}</h3>
              <p className="text-sm text-gray-500 truncate">{session.mentorTitle}</p>
            </div>
            <div>
              {getStatusBadge()}
            </div>
          </div>
        </div>
        
        {/* Session Details */}
        <div className="p-6">
          {/* Topic */}
          {session.topic && (
            <p className="text-base font-medium text-gray-800 mb-4">{session.topic}</p>
          )}
          
          {/* Date & Time */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{session.time} ({session.duration})</span>
            </div>
          </div>
          
          {/* Status with icon */}
          {(session.status === "completed" || session.status === "canceled") && (
            <div className="flex items-center text-sm font-medium">
              {getStatusIcon()}
              <span className={`ml-1.5 ${session.status === "completed" ? "text-green-600" : "text-red-600"}`}>
                {session.status === "completed" ? "Session completed" : "Session canceled"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Card Footer with Actions */}
      <CardFooter className="p-6 pt-0 flex flex-wrap gap-2 justify-between">
        {session.status === "upcoming" && (
          <Button 
            onClick={() => joinSession(session.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Join Session
          </Button>
        )}
        
        {session.status === "completed" && (
          <Button 
            variant="outline"
            onClick={() => rateMentor(session.id)}
            className="border-green-500 text-green-700 hover:bg-green-50"
          >
            <Star className="mr-1 h-4 w-4" />
            Rate Mentor
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => viewSessionDetails(session.id)}
          className="ml-auto"
        >
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
