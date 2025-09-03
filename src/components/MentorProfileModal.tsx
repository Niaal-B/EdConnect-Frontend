
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Star, GraduationCap, Globe, Clock, CalendarCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

// Dummy reviews data
const dummyReviews = [
  {
    id: 1,
    name: "Alex Zhang",
    rating: 5,
    comment: "Incredibly helpful and knowledgeable. Helped me improve my interview skills tremendously!",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Maria Johnson",
    rating: 4,
    comment: "Great mentor with practical advice. Would definitely recommend for anyone pursuing a similar career path.",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Raj Patel",
    rating: 5,
    comment: "Exceeded my expectations. Very clear explanations and personalized guidance.",
    date: "2 months ago"
  }
];

interface MentorProfileModalProps {
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
  isOpen: boolean;
  onClose: () => void;
  onBookSession: () => void;
}

const MentorProfileModal = ({
  mentor,
  isOpen,
  onClose,
  onBookSession,
}: MentorProfileModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessionDuration, setSessionDuration] = useState("30");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // Generate array of times from 9 AM to 5 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      const hourStr = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${hourStr}:00 ${ampm}`);
      slots.push(`${hourStr}:30 ${ampm}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingConfirm = () => {
    onBookSession();
    setIsBookingOpen(false);
  };

  const formattedDate = selectedDate ? format(selectedDate, "MMMM d, yyyy") : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Mentor Profile</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Left Column: Profile Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col items-center">
              <Avatar className="h-28 w-28">
                <AvatarImage src={mentor.image} alt={mentor.name} />
                <AvatarFallback className="text-xl">
                  {mentor.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-xl mt-4">{mentor.name}</h3>
              <p className="text-muted-foreground text-sm text-center">
                {mentor.title}
              </p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  ({mentor.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center mt-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2 text-sm">{mentor.university}</span>
              </div>
              <div className="mt-4 w-full">
                <h4 className="text-sm font-medium mb-2">Areas of Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 w-full">
                <h4 className="text-sm font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{mentor.bio}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column: Booking and Reviews */}
          <div className="col-span-1 md:col-span-2">
            {/* Booking Section */}
            <div className="p-4 border rounded-lg bg-card mb-4">
              <h3 className="font-medium text-lg mb-4">Book a Session</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Calendar Section */}
                <Collapsible 
                  open={isCalendarOpen} 
                  onOpenChange={setIsCalendarOpen}
                  className="border rounded-md mb-2"
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex w-full justify-between p-4 font-medium text-left"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4" />
                        <span>{selectedDate ? `Selected Date: ${formattedDate}` : "Select a Date"}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isCalendarOpen ? "Click to collapse" : "Click to expand"}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 bg-muted/30">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="rounded-md border pointer-events-auto w-full"
                      disabled={(date) => {
                        // Disable past dates and weekends
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const day = date.getDay();
                        return date < today || day === 0 || day === 6;
                      }}
                    />
                  </CollapsibleContent>
                </Collapsible>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Available Time Slots {selectedDate && `for ${formattedDate}`}</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {timeSlots.map((slot, index) => (
                      <Button 
                        key={index} 
                        variant={selectedTime === slot ? "default" : "outline"} 
                        size="sm"
                        className={`${index % 3 === 0 ? "bg-muted/50 cursor-not-allowed" : ""}`}
                        disabled={index % 3 === 0}
                        onClick={() => handleTimeSelect(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Session Duration</h4>
                  <Select
                    value={sessionDuration}
                    onValueChange={setSessionDuration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full mt-2"
                  disabled={!selectedTime || !selectedDate}
                >
                  Book Session
                </Button>
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="border rounded-lg bg-card">
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Reviews</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {mentor.reviews} reviews from students
                </p>
                {dummyReviews.map((review, index) => (
                  <div key={review.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{review.name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{review.comment}</p>
                    {index < dummyReviews.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Booking Confirmation Dialog */}
      <AlertDialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to book a {sessionDuration}-minute session with {mentor.name} on {formattedDate} at {selectedTime}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBookingConfirm}>Confirm Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default MentorProfileModal;
