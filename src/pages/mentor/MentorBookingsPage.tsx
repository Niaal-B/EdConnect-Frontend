
import React, { useState } from 'react';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, CalendarPlus, BookOpen, Clock, Calendar } from 'lucide-react';

// Mock data for booking requests
const bookingRequests = [
  {
    id: 1,
    student: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?&w=128&h=128&fit=crop&crop=face',
      country: 'Singapore',
      university: 'Planning to apply to MIT'
    },
    date: new Date(2025, 4, 15, 10, 0), // May 15, 2025, 10:00
    endTime: new Date(2025, 4, 15, 11, 0), // May 15, 2025, 11:00
    topic: 'US University Applications',
    message: "I'd like to discuss my application strategy for top US universities. I'm interested in Computer Science programs and want advice on strengthening my application."
  },
  {
    id: 2,
    student: {
      name: 'Miguel Santos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?&w=128&h=128&fit=crop&crop=face',
      country: 'Brazil',
      university: 'Interested in Oxford University'
    },
    date: new Date(2025, 4, 18, 16, 0), // May 18, 2025, 16:00
    endTime: new Date(2025, 4, 18, 17, 0), // May 18, 2025, 17:00
    topic: 'MBA Programs in UK',
    message: "I'm applying to MBA programs in the UK and would appreciate guidance on scholarship opportunities and application timelines."
  },
  {
    id: 3,
    student: {
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?&w=128&h=128&fit=crop&crop=face',
      country: 'Nigeria',
      university: 'Considering Canadian medical schools'
    },
    date: new Date(2025, 4, 10, 14, 0), // May 10, 2025, 14:00
    endTime: new Date(2025, 4, 10, 15, 0), // May 10, 2025, 15:00
    topic: 'Medical School Interviews',
    message: "I have upcoming interviews with several Canadian medical schools. I'd like help with interview preparation and guidance on what to expect."
  }
];

// Mock data for confirmed bookings
const confirmedBookings = [
  {
    id: 4,
    student: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?&w=128&h=128&fit=crop&crop=face',
      country: 'Singapore',
      university: 'Planning to apply to MIT'
    },
    date: new Date(2025, 4, 15, 10, 0), // May 15, 2025, 10:00
    endTime: new Date(2025, 4, 15, 11, 0), // May 15, 2025, 11:00
    topic: 'US University Applications',
    status: 'upcoming'
  },
  {
    id: 5,
    student: {
      name: 'Jamal Wilson',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?&w=128&h=128&fit=crop&crop=face',
      country: 'United States',
      university: 'Harvard University'
    },
    date: new Date(2025, 4, 16, 15, 0), // May 16, 2025, 15:00
    endTime: new Date(2025, 4, 16, 16, 0), // May 16, 2025, 16:00
    topic: 'Scholarship Strategy',
    status: 'upcoming'
  },
  {
    id: 6,
    student: {
      name: 'Wei Liu',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?&w=128&h=128&fit=crop&crop=face',
      country: 'China',
      university: 'UCLA'
    },
    date: new Date(2025, 4, 5, 9, 0), // May 5, 2025, 9:00
    endTime: new Date(2025, 4, 5, 10, 0), // May 5, 2025, 10:00
    topic: 'Scholarship Applications',
    status: 'completed'
  },
  {
    id: 7,
    student: {
      name: 'Elena Petrova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?&w=128&h=128&fit=crop&crop=face',
      country: 'Russia',
      university: 'Oxford University'
    },
    date: new Date(2025, 4, 2, 13, 0), // May 2, 2025, 13:00
    endTime: new Date(2025, 4, 2, 14, 0), // May 2, 2025, 14:00
    topic: 'Campus Life in the UK',
    status: 'completed'
  }
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

const MentorBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmedFilter, setConfirmedFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Filter booking requests based on search query
  const filteredRequests = bookingRequests.filter(request =>
    request.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter confirmed bookings based on search query and status filter
  const filteredConfirmed = confirmedBookings.filter(booking => {
    const matchesSearch = booking.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (confirmedFilter === 'all') return matchesSearch;
    return matchesSearch && booking.status === confirmedFilter;
  });

  return (
    <MentorDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 mt-1">Manage student booking requests and scheduled sessions</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button className="bg-bridgeblue-500 hover:bg-bridgeblue-600">
              <CalendarPlus className="mr-2 h-4 w-4" /> Set Availability
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-lightgray-200 w-full sm:w-auto">
                <TabsTrigger value="requests" className="flex-1 sm:flex-initial">
                  <BookOpen className="h-4 w-4 mr-2" /> Booking Requests ({bookingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="flex-1 sm:flex-initial">
                  <Calendar className="h-4 w-4 mr-2" /> Confirmed Bookings ({confirmedBookings.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
          </div>
        </div>

        <TabsContent value="requests" className="mt-0">
          {filteredRequests.length > 0 ? (
            <div className="space-y-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={request.student.avatar} alt={request.student.name} />
                        <AvatarFallback>{request.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{request.student.name}</CardTitle>
                        <div className="text-sm text-gray-500">{request.student.country} • {request.student.university}</div>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">{formatDate(request.date)} • {formatTime(request.date)} - {formatTime(request.endTime)}</span>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">Topic</div>
                        <div className="font-medium">{request.topic}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">Student Message</div>
                        <div className="text-sm bg-gray-50 p-3 rounded-md italic">"{request.message}"</div>
                      </div>
                      
                      <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
                        <Button className="bg-bridgeblue-500 hover:bg-bridgeblue-600">Accept & Schedule</Button>
                        <Button variant="outline">Message Student</Button>
                        <Button variant="ghost" className="text-gray-500">Decline</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-gray-50">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No booking requests</h3>
              <p className="text-gray-500 text-center mb-4">
                {searchQuery ? 'Try adjusting your search' : 'You have no pending booking requests at this time'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-0">
          <div className="mb-6 flex justify-end">
            <Tabs value={confirmedFilter} onValueChange={(value) => setConfirmedFilter(value as any)} className="w-auto">
              <TabsList className="bg-lightgray-200">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredConfirmed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConfirmed.map((booking) => (
                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={booking.student.avatar} alt={booking.student.name} />
                        <AvatarFallback>{booking.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{booking.student.name}</CardTitle>
                        <div className="text-sm text-gray-500">{booking.student.country}</div>
                      </div>
                    </div>
                    <Badge 
                      className={
                        booking.status === 'upcoming' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                        'bg-blue-100 text-blue-800 hover:bg-blue-100'
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">{formatDate(booking.date)} • {formatTime(booking.date)} - {formatTime(booking.endTime)}</span>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">Topic</div>
                        <div className="font-medium">{booking.topic}</div>
                      </div>
                      
                      <div className="flex justify-between mt-4 pt-3 border-t">
                        <Button variant="outline" size="sm">View Details</Button>
                        
                        {booking.status === 'upcoming' && (
                          <Button size="sm">Join Session</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-gray-50">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No confirmed bookings</h3>
              <p className="text-gray-500 text-center mb-4">
                {searchQuery ? 'Try adjusting your search or filters' : 'You have no confirmed bookings at this time'}
              </p>
            </div>
          )}
        </TabsContent>
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorBookingsPage;
