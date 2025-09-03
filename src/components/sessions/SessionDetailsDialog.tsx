
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, FileText, X } from "lucide-react";
import { Session } from "./SessionsProvider";
import { format } from "date-fns";

interface SessionDetailsDialogProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
  onJoinSession?: () => void;
  onRateMentor?: () => void;
}

const SessionDetailsDialog: React.FC<SessionDetailsDialogProps> = ({
  session,
  open,
  onClose,
  onJoinSession,
  onRateMentor,
}) => {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Session Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Mentor Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-blue-100">
              <AvatarImage src={session.mentorImage} alt={session.mentorName} />
              <AvatarFallback>{session.mentorName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{session.mentorName}</h3>
              <p className="text-gray-500">{session.mentorTitle}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex">
            {session.status === "upcoming" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Upcoming
              </span>
            )}
            {session.status === "completed" && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Completed
              </span>
            )}
            {session.status === "canceled" && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                Canceled
              </span>
            )}
          </div>
          
          {/* Session Info */}
          <div className="space-y-3 border-t border-b border-gray-100 py-4">
            {/* Topic */}
            {session.topic && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Topic</p>
                  <p>{session.topic}</p>
                </div>
              </div>
            )}
            
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p>{format(new Date(session.date), "EEEE, MMMM d, yyyy")}</p>
              </div>
            </div>
            
            {/* Time & Duration */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p>{session.time} ({session.duration})</p>
              </div>
            </div>
            
            {/* Meeting Link */}
            {session.status === "upcoming" && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Meeting Link</p>
                  <p className="text-blue-600">Video Conference Link</p>
                </div>
              </div>
            )}
            
            {/* Notes */}
            {session.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-gray-700">{session.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-between">
          {session.status === "upcoming" && onJoinSession && (
            <Button onClick={onJoinSession} className="bg-blue-600 hover:bg-blue-700">
              Join Session
            </Button>
          )}
          
          {session.status === "completed" && onRateMentor && (
            <Button 
              variant="outline" 
              onClick={onRateMentor}
              className="border-green-500 text-green-700 hover:bg-green-50"
            >
              Rate Mentor
            </Button>
          )}
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsDialog;
