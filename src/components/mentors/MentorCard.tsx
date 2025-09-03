
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MessageSquare, Star } from "lucide-react";

interface MentorCardProps {
  mentor: {
    id: number;
    name: string;
    title: string;
    university: string;
    rating: number;
    reviews: number;
    status: string;
    image: string;
    expertise: string[];
    bio: string;
  };
  onViewProfile: (mentor: any) => void;
  onOpenChat: (mentor: any) => void;
  onBookSession: (mentor: any) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  onViewProfile,
  onOpenChat,
  onBookSession,
}) => {
  return (
    <Card key={mentor.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.image} alt={mentor.name} />
            <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{mentor.name}</h3>
            <p className="text-muted-foreground text-sm truncate">{mentor.title}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({mentor.reviews} reviews)
              </span>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  mentor.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {mentor.status}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/30 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewProfile(mentor)}
          className="flex-1"
        >
          View Profile
        </Button>
        <Button 
          variant="outline"
          size="sm" 
          onClick={() => onOpenChat(mentor)}
          className="flex-1"
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          Chat
        </Button>
        <Button 
          size="sm" 
          onClick={() => onBookSession(mentor)}
          className="flex-1"
        >
          <Calendar className="mr-1 h-4 w-4" />
          Book
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
