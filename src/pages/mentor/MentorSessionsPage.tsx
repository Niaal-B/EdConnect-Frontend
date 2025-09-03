import React, { useState } from 'react';
import { CalendarDays, Calendar as CalendarIcon, List, Search, Plus, CalendarPlus, Check, Star } from 'lucide-react';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Calendar } from "@/components/ui/calendar";
import AvailabilityDialog from '@/components/availability/AvailabilityDialog';

// Mock data for mentor sessions
const mentorSessions = [
  {
    id: 1,
    student: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?&w=128&h=128&fit=crop&crop=face',
      country: 'Singapore'
    },
    date: new Date(2025, 4, 15, 10, 0), // May 15, 2025, 10:00
    endTime: new Date(2025, 4, 15, 11, 0), // May 15, 2025, 11:00
    topic: 'US University Applications',
    status: 'upcoming',
    notes: 'Review personal statement draft and discuss scholarship options',
    joinLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 2,
    student: {
      name: 'Miguel Santos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?&w=128&h=128&fit=crop&crop=face',
      country: 'Brazil'
    },
    date: new Date(2025, 4, 18, 16, 0), // May 18, 2025, 16:00
    endTime: new Date(2025, 4, 18, 17, 0), // May 18, 2025, 17:00
    topic: 'MBA Programs in UK',
    status: 'upcoming',
    notes: 'Discuss application timeline and required documents',
    joinLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 3,
    student: {
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?&w=128&h=128&fit=crop&crop=face',
      country: 'Nigeria'
    },
    date: new Date(2025, 4, 10, 14, 0), // May 10, 2025, 14:00
    endTime: new Date(2025, 4, 10, 15, 0), // May 10, 2025, 15:00
    topic: 'Medical School Interviews',
    status: 'completed',
    notes: 'Practiced interview questions and discussed application strengths',
    joinLink: 'https://meet.google.com/abc-defg-hij',
    feedback: {
      rating: 5,
      comment: "Thank you for the excellent interview prep! I feel much more confident now."
    }
  },
  {
    id: 4,
    student: {
      name: 'Wei Liu',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?&w=128&h=128&fit=crop&crop=face',
      country: 'China'
    },
    date: new Date(2025, 4, 5, 9, 0), // May 5, 2025, 9:00
    endTime: new Date(2025, 4, 5, 10, 0), // May 5, 2025, 10:00
    topic: 'Scholarship Applications',
    status: 'completed',
    notes: 'Reviewed essay drafts and suggested improvements',
    joinLink: 'https://meet.google.com/abc-defg-hij',
    feedback: {
      rating: 5,
      comment: "Excellent guidance on improving my scholarship essays. Already received my first offer!"
    }
  },
  {
    id: 5,
    student: {
      name: 'Omar Khan',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?&w=128&h=128&fit=crop&crop=face',
      country: 'Pakistan'
    },
    date: new Date(2025, 4, 20, 11, 0), // May 20, 2025, 11:00
    endTime: new Date(2025, 4, 20, 12, 0), // May 20, 2025, 12:00
    topic: 'Engineering Programs Research',
    status: 'cancelled',
    notes: 'Student requested to reschedule',
    joinLink: 'https://meet.google.com/abc-defg-hij'
  }
];

// Mock data for availability
const availabilitySlots = [
  { date: new Date(2025, 4, 12), startTime: "09:00", endTime: "11:00" },
  { date: new Date(2025, 4, 13), startTime: "13:00", endTime: "15:00" },
  { date: new Date(2025, 4, 14), startTime: "10:00", endTime: "12:00" },
];

// Utility function to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Utility function to format time
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

const MentorSessionsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<typeof mentorSessions[0] | null>(null);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filter sessions based on search query and filter
  const filteredSessions = mentorSessions.filter(session => {
    const matchesSearch = session.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        session.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && session.status === filter;
  });

  // Get events for selected date in calendar view
  const getEventsForDate = (date: Date) => {
    if (!date) return { events: [], availabilities: [] };
    
    const events = filteredSessions.filter(session => 
      session.date.getDate() === date.getDate() && 
      session.date.getMonth() === date.getMonth() && 
      session.date.getFullYear() === date.getFullYear()
    );
    
    const availabilities = availabilitySlots.filter(slot => 
      slot.date.getDate() === date.getDate() && 
      slot.date.getMonth() === date.getMonth() && 
      slot.date.getFullYear() === date.getFullYear()
    );
    
    return { events, availabilities };
  };

  const isDateWithEvent = (date: Date): boolean => {
    if (!date) return false;
    
    return filteredSessions.some(session => 
      session.date.getDate() === date.getDate() && 
      session.date.getMonth() === date.getMonth() && 
      session.date.getFullYear() === date.getFullYear()
    ) || availabilitySlots.some(slot => 
      slot.date.getDate() === date.getDate() && 
      slot.date.getMonth() === date.getMonth() && 
      slot.date.getFullYear() === date.getFullYear()
    );
  };

  const renderCalendarDay = (date: Date | undefined) => {
    if (!date) return null;
    
    const hasEvent = isDateWithEvent(date);
    return hasEvent ? <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-1"></div> : null;
  };

  const { events = [], availabilities = [] } = selectedDate ? getEventsForDate(selectedDate) : { events: [], availabilities: [] };

  return (
    <MentorDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-500 mt-1">Manage your mentoring sessions</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button 
              className="bg-bridgeblue-500 hover:bg-bridgeblue-600"
              onClick={() => setShowAvailabilityDialog(true)}
            >
              <CalendarPlus className="mr-2 h-4 w-4" /> Set Availability
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-2">
              <Button 
                variant={view === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4 mr-2" /> List
              </Button>
              <Button 
                variant={view === 'calendar' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('calendar')}
              >
                <CalendarIcon className="h-4 w-4 mr-2" /> Calendar
              </Button>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              
              <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-auto">
                <TabsList className="bg-lightgray-200">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {view === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={session.student.avatar} alt={session.student.name} />
                          <AvatarFallback>{session.student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{session.student.name}</CardTitle>
                          <CardDescription>{session.student.country}</CardDescription>
                        </div>
                      </div>
                      <Badge 
                        className={
                          session.status === 'upcoming' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                          session.status === 'completed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                          'bg-red-100 text-red-800 hover:bg-red-100'
                        }
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Topic</div>
                        <div className="font-medium">{session.topic}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">Date & Time</div>
                        <div className="font-medium">
                          {formatDate(session.date)} • {formatTime(session.date)} - {formatTime(session.endTime)}
                        </div>
                      </div>
                      
                      {session.feedback && (
                        <div>
                          <div className="text-sm font-medium text-gray-500">Feedback</div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < session.feedback!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSession(session)}
                    >
                      View Details
                    </Button>
                    
                    {session.status === 'upcoming' && (
                      <Button size="sm">Join Session</Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-gray-50">
                <CalendarDays className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No sessions found</h3>
                <p className="text-gray-500 text-center mb-4">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Set your availability to start mentoring students'}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Set Availability
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Calendar View</CardTitle>
                <CardDescription>Select a date to view sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-0 pointer-events-auto"
                  components={{
                    DayContent: ({ date }) => (
                      <div className="flex flex-col items-center">
                        <div>{date.getDate()}</div>
                        {renderCalendarDay(date)}
                      </div>
                    )
                  }}
                />
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <div className="flex items-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                    <span>Events</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'No Date Selected'}
                </CardTitle>
                <CardDescription>Sessions and availability for this date</CardDescription>
              </CardHeader>
              <CardContent>
                {events.length === 0 && availabilities.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No sessions or availability slots for this date</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowAvailabilityDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Set Availability
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Show availabilities */}
                    {availabilities.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-800 flex items-center">
                          <CalendarPlus className="h-4 w-4 mr-2 text-green-600" /> Available Time Slots
                        </h3>
                        
                        <div className="space-y-2">
                          {availabilities.map((slot, index) => (
                            <div key={index} className="flex items-center p-3 bg-green-50 border border-green-100 rounded-md">
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                              <span>{slot.startTime} - {slot.endTime}</span>
                              <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show sessions */}
                    {events.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-800 flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-blue-600" /> Sessions
                        </h3>
                        
                        <div className="space-y-2">
                          {events.map((session) => (
                            <div key={session.id} className="p-3 border rounded-md hover:shadow-sm transition-shadow">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={session.student.avatar} alt={session.student.name} />
                                  <AvatarFallback>{session.student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">{session.student.name}</div>
                                  <div className="text-sm text-gray-500">{formatTime(session.date)} - {formatTime(session.endTime)}</div>
                                </div>
                                <Badge 
                                  className={
                                    session.status === 'upcoming' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                    session.status === 'completed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                                    'bg-red-100 text-red-800 hover:bg-red-100'
                                  }
                                >
                                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="mt-2 text-sm">{session.topic}</div>
                              {session.status === 'upcoming' && (
                                <div className="mt-3 flex justify-end">
                                  <Button size="sm">Join Session</Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Session Details Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        {selectedSession && (
          <>
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                Session with {selectedSession.student.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={selectedSession.student.avatar} alt={selectedSession.student.name} />
                  <AvatarFallback>{selectedSession.student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedSession.student.name}</h3>
                  <p className="text-sm text-gray-500">{selectedSession.student.country}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Date</div>
                  <div>{formatDate(selectedSession.date)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Time</div>
                  <div>{formatTime(selectedSession.date)} - {formatTime(selectedSession.endTime)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-500">Topic</div>
                  <div className="font-medium">{selectedSession.topic}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <Badge 
                    className={
                      selectedSession.status === 'upcoming' ? 'bg-green-100 text-green-800' : 
                      selectedSession.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }
                  >
                    {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-500">Notes</div>
                  <div>{selectedSession.notes}</div>
                </div>

                {selectedSession.feedback && (
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-500">Student Feedback</div>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < selectedSession.feedback!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm italic">"{selectedSession.feedback.comment}"</div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              
              {selectedSession.status === 'upcoming' && (
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <Button variant="outline" className="text-red-500 hover:text-red-600">
                    Cancel Session
                  </Button>
                  <Button>Join Session</Button>
                </div>
              )}
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* Availability Dialog */}
      <AvailabilityDialog 
        open={showAvailabilityDialog} 
        onClose={() => setShowAvailabilityDialog(false)}
      />
    </MentorDashboardLayout>
  );
};

export default MentorSessionsPage;
