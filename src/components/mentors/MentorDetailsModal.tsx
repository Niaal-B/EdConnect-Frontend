import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  MessageSquare, 
  Phone, 
  User,
  BookOpen,
  Globe
} from "lucide-react";
import { Mentor } from "@/services/mentorApi";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface MentorDetailsModalProps {
  mentor: Mentor;
  isOpen: boolean;
  onClose: () => void;
}

interface Connection {
  id: number;
  status: string;
  mentor: number;
}

export function MentorDetailsModal({ mentor, isOpen, onClose }: MentorDetailsModalProps) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getExpertiseArray = (): string[] => {
    if (Array.isArray(mentor.expertise)) {
      return mentor.expertise;
    }
    if (typeof mentor.expertise === 'object' && mentor.expertise !== null) {
      return Object.keys(mentor.expertise);
    }
    return [];
  };

  const expertiseList = getExpertiseArray();
  const displayName = mentor.name || mentor.username || `Mentor ${mentor.id}`;
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  const fetchConnectionStatus = async () => {
    try {
      const res = await api.get("connections/");
      const existing = res.data.results.find((conn: Connection) => conn.mentor === (mentor.user_id || mentor.id));
      setConnection(existing || null);
    } catch {
      setConnection(null);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await api.post("connections/request/", { mentor_id: mentor.user_id || mentor.id });
      setConnection(res.data);
      toast({ title: "Request Sent", description: "Connection request sent successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to send connection request.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!connection) return;
    setLoading(true);
    try {
      await api.delete(`connections/${connection.id}/cancel/`);
      setConnection(null);
      toast({ title: "Request Cancelled", description: "Connection request cancelled." });
    } catch {
      toast({ title: "Error", description: "Failed to cancel request.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConnectionStatus();
    }
  }, [isOpen, mentor.id, mentor.user_id]);

  const renderConnectButton = () => {
    if (!connection || connection.status === "rejected") {
      return (
        <Button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          onClick={handleConnect}
          disabled={loading}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {loading ? "Connecting..." : `Connect with ${displayName.split(' ')[0]}`}
        </Button>
      );
    }

    if (connection.status === "pending") {
      return (
        <Button 
          variant="outline" 
          className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600"
          onClick={handleCancel}
          disabled={loading}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {loading ? "Cancelling..." : "Request Pending"}
        </Button>
      );
    }

    if (connection.status === "accepted") {
      return (
        <Button 
          disabled 
          className="flex-1 bg-green-500 text-white hover:bg-green-600 cursor-default"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Connected to {displayName.split(' ')[0]}
        </Button>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Mentor Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-white shadow-lg">
                <AvatarImage src={mentor.profile_picture || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {mentor.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <Award className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayName}</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{mentor.experience_years} years experience</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{mentor.rating || 4.8} ({mentor.reviews || 'New'})</span>
                </div>
                {mentor.price && (
                  <div className="text-lg font-bold text-gray-900">
                    ${mentor.price}/hr
                  </div>
                )}
              </div>
              
              {mentor.verification_status && (
                <Badge 
                  variant={mentor.verification_status === 'approved' ? 'default' : 'secondary'}
                  className="mb-2"
                >
                  {mentor.verification_status === 'approved' ? 'Verified' : mentor.verification_status}
                </Badge>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {mentor.bio && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                About
              </h4>
              <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
            </div>
          )}

          {/* Contact Information */}
          {mentor.phone && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact
              </h4>
              <p className="text-gray-700">{mentor.phone}</p>
            </div>
          )}

          {/* Countries */}
          {mentor.countries && mentor.countries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Countries
              </h4>
              <div className="flex flex-wrap gap-2">
                {mentor.countries.map((country, idx) => (
                  <Badge key={idx} variant="outline" className="capitalize">
                    <MapPin className="h-3 w-3 mr-1" />
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {mentor.courses && mentor.courses.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Specialization
              </h4>
              <div className="flex flex-wrap gap-2">
                {mentor.courses.map((course, idx) => (
                  <Badge key={idx} variant="outline" className="capitalize">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Expertise */}
          {expertiseList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900">
                Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {expertiseList.map((skill, idx) => (
                  <Badge key={idx} className="capitalize bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {renderConnectButton()}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}