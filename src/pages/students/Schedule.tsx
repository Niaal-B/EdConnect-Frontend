import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Globe,
  XCircle,
  Video,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  TimerIcon,
  Ban,
  CheckCheck,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import api from '@/lib/api';
import ZegoVideoCall from '@/components/ZegoVideoCall';
import FeedbackDialog from '@/components/FeedbackDialog';

interface SlotInfo {
  id: number;
  start_time: string;
  end_time: string;
  fee: string;
  timezone: string;
  status: string;
}

interface MentorUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface MentorProfileInfo {
  id: number;
  user: MentorUser;
  bio: string;
  phone: string;
  expertise: any;
  countries: string[];
  courses: string[];
  experience_years: number;
  is_verified: boolean;
  verification_status: string;
  profile_picture: string;
  rejection_reason: string;
  last_status_update: string;
}

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id: string;
  student: number;
  mentor: number;
  slot: number;
  mentor_profile_info: MentorProfileInfo;
  slot_info: SlotInfo;
  booked_start_time: string;
  booked_end_time: string;
  booked_fee: string;
  booked_timezone: string;
  status:
    | 'PENDING_PAYMENT'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELED_BY_STUDENT_FULL_REFUND'
    | 'CANCELED_BY_STUDENT_NO_REFUND'
    | 'CANCELED_BY_MENTOR';
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'NO_REFUND';
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string;
  feedback?: Feedback; // New optional feedback property
  created_at: string;
  updated_at: string;
}

interface BookingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
  message?: string;
}

interface UserData {
  id: number;
  email: string;
  username: string;
  role: string;
  profile_picture: string;
}

interface ActiveCallDetails {
  roomId: string;
  userId: string;
  userName: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

type BookingStatus = 'ALL' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED_BY_STUDENT_FULL_REFUND' | 'CANCELED_BY_STUDENT_NO_REFUND' | 'CANCELED_BY_MENTOR';

const Schedule = () => {
  const navigate = useNavigate();
  const [bookingsByStatus, setBookingsByStatus] = useState<Record<BookingStatus, Booking[]>>({
    ALL: [],
    PENDING_PAYMENT: [],
    CONFIRMED: [],
    COMPLETED: [],
    CANCELED_BY_STUDENT_FULL_REFUND: [],
    CANCELED_BY_STUDENT_NO_REFUND: [],
    CANCELED_BY_MENTOR: [],
  });
  
  const [isLoading, setIsLoading] = useState<Record<BookingStatus, boolean>>({
    ALL: true,
    PENDING_PAYMENT: false,
    CONFIRMED: false,
    COMPLETED: false,
    CANCELED_BY_STUDENT_FULL_REFUND: false,
    CANCELED_BY_STUDENT_NO_REFUND: false,
    CANCELED_BY_MENTOR: false,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<BookingStatus>('ALL');
  
  const [paginationByStatus, setPaginationByStatus] = useState<Record<BookingStatus, PaginationInfo>>({
    ALL: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, hasNext: false, hasPrevious: false },
    PENDING_PAYMENT: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, hasNext: false, hasPrevious: false },
    CONFIRMED: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, hasNext: false, hasPrevious: false },
    COMPLETED: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, hasNext: false, hasPrevious: false },
    CANCELED_BY_STUDENT_FULL_REFUND: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, hasNext: false, hasPrevious: false },
    CANCELED_BY_STUDENT_NO_REFUND: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, hasNext: false, hasPrevious: false },
    CANCELED_BY_MENTOR: { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0, hasNext: false, hasPrevious: false },
  });

  const { toast } = useToast();
  const [activeCallDetails, setActiveCallDetails] = useState<ActiveCallDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const statusTabs = [
    { 
      key: 'ALL' as BookingStatus, 
      label: 'All Sessions', 
      icon: Calendar,
      description: 'All your booked sessions'
    },
    { 
      key: 'PENDING_PAYMENT' as BookingStatus, 
      label: 'Pending Payment', 
      icon: CreditCard,
      description: 'Sessions waiting for payment'
    },
    { 
      key: 'CONFIRMED' as BookingStatus, 
      label: 'Confirmed', 
      icon: CheckCircle,
      description: 'Confirmed and upcoming sessions'
    },
    { 
      key: 'COMPLETED' as BookingStatus, 
      label: 'Completed', 
      icon: CheckCheck,
      description: 'Successfully completed sessions'
    },
    { 
      key: 'CANCELED_BY_STUDENT_FULL_REFUND' as BookingStatus, 
      label: 'Cancelled (Refunded)', 
      icon: Ban,
      description: 'Cancelled sessions with refund'
    },
    { 
      key: 'CANCELED_BY_STUDENT_NO_REFUND' as BookingStatus, 
      label: 'Cancelled (No Refund)', 
      icon: XCircle,
      description: 'Cancelled sessions without refund'
    },
    { 
      key: 'CANCELED_BY_MENTOR' as BookingStatus, 
      label: 'Mentor Cancelled', 
      icon: AlertCircle,
      description: 'Sessions cancelled by mentor'
    },
  ];

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/check-session');
      if (response.data.valid) {
        setCurrentUser(response.data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user session:", err);
      setCurrentUser(null);
    }
  };

  const fetchBookings = async (status: BookingStatus, page: number = 1, pageSize: number = 10) => {
    setIsLoading(prev => ({ ...prev, [status]: true }));
    setError(null);
    
    try {
      let url = `bookings/student-bookings/?page=${page}&page_size=${pageSize}`;
      if (status !== 'ALL') {
        url += `&status=${status}`;
      }
      
      const response = await api.get(url);
      
      let filteredBookings = [];
      
      if (Array.isArray(response.data)) {
        // Handle case where API returns array directly (no pagination)
        filteredBookings = status === 'ALL' 
          ? response.data 
          : response.data.filter(booking => booking.status === status);
      } else if (response.data && 'results' in response.data) {
        // Handle paginated response
        filteredBookings = status === 'ALL' 
          ? response.data.results 
          : response.data.results.filter(booking => booking.status === status);
      } else {
        filteredBookings = [];
      }
      
      // Update state with filtered bookings
      setBookingsByStatus(prev => ({
        ...prev,
        [status]: filteredBookings
      }));
      
      // Calculate pagination based on filtered results
      const totalFiltered = filteredBookings.length;
      const totalPages = Math.ceil(totalFiltered / pageSize);
      
      setPaginationByStatus(prev => ({
        ...prev,
        [status]: {
          currentPage: page,
          totalPages: Math.max(1, totalPages),
          pageSize,
          totalCount: totalFiltered,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        }
      }));
      
    } catch (err) {
      console.error(`Failed to fetch bookings for status ${status}:`, err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or invalid. Please log in again.");
      } else {
        setError("Unable to load your booked sessions. Please try again later.");
      }
      
      // Set empty state on error
      setBookingsByStatus(prev => ({
        ...prev,
        [status]: []
      }));
      setPaginationByStatus(prev => ({
        ...prev,
        [status]: {
          currentPage: 1,
          totalPages: 0,
          pageSize,
          totalCount: 0,
          hasNext: false,
          hasPrevious: false,
        }
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [status]: false }));
    }
  };

  // Function to fetch all bookings and then distribute them by status
  const fetchAndDistributeBookings = async (page: number = 1, pageSize: number = 10) => {
    setIsLoading(prev => ({ ...prev, ALL: true }));
    setError(null);
    
    try {
      const response = await api.get(`bookings/student-bookings/?page=${page}&page_size=${pageSize}`);
      
      let allBookings = [];
      
      if (Array.isArray(response.data)) {
        allBookings = response.data;
      } else if (response.data && 'results' in response.data) {
        allBookings = response.data.results;
      }
      
      // Distribute bookings by status
      const bookingsByStatusMap: Record<BookingStatus, Booking[]> = {
        ALL: allBookings,
        PENDING_PAYMENT: allBookings.filter(b => b.status === 'PENDING_PAYMENT'),
        CONFIRMED: allBookings.filter(b => b.status === 'CONFIRMED'),
        COMPLETED: allBookings.filter(b => b.status === 'COMPLETED'),
        CANCELED_BY_STUDENT_FULL_REFUND: allBookings.filter(b => b.status === 'CANCELED_BY_STUDENT_FULL_REFUND'),
        CANCELED_BY_STUDENT_NO_REFUND: allBookings.filter(b => b.status === 'CANCELED_BY_STUDENT_NO_REFUND'),
        CANCELED_BY_MENTOR: allBookings.filter(b => b.status === 'CANCELED_BY_MENTOR'),
      };
      
      setBookingsByStatus(bookingsByStatusMap);
      
      // Update pagination for all statuses
      const newPagination: Record<BookingStatus, PaginationInfo> = {};
      Object.keys(bookingsByStatusMap).forEach((statusKey) => {
        const status = statusKey as BookingStatus;
        const count = bookingsByStatusMap[status].length;
        const totalPages = Math.max(1, Math.ceil(count / pageSize));
        
        newPagination[status] = {
          currentPage: 1,
          totalPages,
          pageSize,
          totalCount: count,
          hasNext: totalPages > 1,
          hasPrevious: false,
        };
      });
      
      setPaginationByStatus(newPagination);
      
    } catch (err) {
      console.error("Failed to fetch and distribute bookings:", err);
      if (err.response && err.response.status === 401) {
        setError("Session expired or invalid. Please log in again.");
      } else {
        setError("Unable to load your booked sessions. Please try again later.");
      }
    } finally {
      setIsLoading(prev => ({ ...prev, ALL: false }));
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAndDistributeBookings(1, 10);
  }, []);

  const handleTabChange = (newStatus: BookingStatus) => {
    setActiveTab(newStatus);
    // All data is already loaded and filtered, no need to fetch again
  };

  const handlePageChange = (status: BookingStatus, newPage: number) => {
    const pagination = paginationByStatus[status];
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      // Update pagination info
      setPaginationByStatus(prev => ({
        ...prev,
        [status]: {
          ...prev[status],
          currentPage: newPage,
          hasNext: newPage < prev[status].totalPages,
          hasPrevious: newPage > 1,
        }
      }));
    }
  };

  const handlePageSizeChange = (status: BookingStatus, newPageSize: number) => {
    const statusBookings = bookingsByStatus[status];
    const totalPages = Math.max(1, Math.ceil(statusBookings.length / newPageSize));
    
    setPaginationByStatus(prev => ({
      ...prev,
      [status]: {
        currentPage: 1,
        totalPages,
        pageSize: newPageSize,
        totalCount: statusBookings.length,
        hasNext: totalPages > 1,
        hasPrevious: false,
      }
    }));
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED_BY_STUDENT_FULL_REFUND':
      case 'CANCELED_BY_STUDENT_NO_REFUND':
      case 'CANCELED_BY_MENTOR':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'REFUNDED':
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      case 'NO_REFUND':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTimeRemaining = (endTimeString) => {
    const now = new Date();
    const endTime = new Date(endTimeString);
    const diffMs = endTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours;
  };

  const handleCancelSession = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel/`, { reason: 'Student cancelled session' });
      toast({
        title: "Session Cancelled",
        description: "Your session has been successfully cancelled. Please check the payment status for refund details.",
        variant: "default",
      });
      // Refresh data after cancellation
      fetchAndDistributeBookings(1, paginationByStatus['ALL'].pageSize);
    } catch (err) {
      console.error('Error cancelling session:', err);
      const errorMessage = err.response?.data?.detail || "An unexpected error occurred during cancellation.";
      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getCancellationPolicyMessage = (session) => {
    const hoursRemaining = getTimeRemaining(session.booked_start_time);
    if (hoursRemaining > 24) {
      return "You are eligible for a **full refund** as you are cancelling more than 24 hours before the session.";
    } else if (hoursRemaining > 0) {
      return "You are cancelling less than 24 hours before the session. **No refund will be issued** as per the cancellation policy.";
    }
    return "This session is in the past or has already started. It cannot be cancelled.";
  };

  const handleJoinCall = (booking) => {
    const roomId = booking.id;
    if (currentUser) {
      setActiveCallDetails({
        roomId,
        userId: String(currentUser.id),
        userName: currentUser.username,
      });
    } else {
      toast({
        title: "Error",
        description: "User session not found. Please log in again.",
        variant: "destructive",
      });
    }
  };

  // Handle feedback submission callback
  const handleFeedbackSubmitted = () => {
    // Refresh bookings data to reflect the new feedback status
    fetchAndDistributeBookings(1, paginationByStatus['ALL'].pageSize);
  };

  // Check if feedback button should be shown
  const shouldShowFeedbackButton = (booking: Booking): boolean => {
    return booking.status === 'COMPLETED' && !booking.feedback;
  };

  // Get paginated bookings for current tab
  const getPaginatedBookings = (status: BookingStatus) => {
    const allStatusBookings = bookingsByStatus[status];
    const pagination = paginationByStatus[status];
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return allStatusBookings.slice(startIndex, endIndex);
  };

  // Pagination component for a specific status
  const PaginationControls = ({ status }: { status: BookingStatus }) => {
    const pagination = paginationByStatus[status];
    const { currentPage, totalPages, totalCount, hasNext, hasPrevious } = pagination;
    
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * pagination.pageSize + 1, totalCount)} to{' '}
          {Math.min(currentPage * pagination.pageSize, totalCount)} of {totalCount} sessions
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(status, currentPage - 1)}
            disabled={!hasPrevious}
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(status, pageNum)}
                className={`min-w-[2.5rem] ${
                  pageNum === currentPage 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(status, currentPage + 1)}
            disabled={!hasNext}
            className="flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = ({ status, tabInfo }: { status: BookingStatus; tabInfo: any }) => (
    <Card className="p-12 text-center">
      <tabInfo.icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No {status === 'ALL' ? 'Sessions' : tabInfo.label}
      </h3>
      <p className="text-gray-600 mb-6">{tabInfo.description}</p>
      {status === 'ALL' && (
        <Button 
          onClick={() => navigate('/student/discover')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Browse Mentors
        </Button>
      )}
    </Card>
  );

  // Session card component
  const SessionCard = ({ booking }) => {
    const startDateTime = formatDateTime(booking.booked_start_time);
    const endDateTime = formatDateTime(booking.booked_end_time);
    const mentorName = booking.mentor_profile_info.user.username;
    
    const isCancellable = 
      booking.status === 'CONFIRMED' && 
      new Date(booking.booked_start_time) > new Date();
      
    const sessionStartTime = new Date(booking.booked_start_time);
    const now = new Date();
    const isSessionActive = 
      booking.status === 'CONFIRMED'&&
      now <= new Date(sessionStartTime.getTime() - 10 * 60000) &&
      now <= new Date(booking.booked_end_time);
      
    const showFeedbackButton = shouldShowFeedbackButton(booking);

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
                <AvatarImage src={booking.mentor_profile_info.profile_picture} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                  {mentorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{mentorName}</h3>
                <p className="text-gray-600">{booking.mentor_profile_info.bio}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge
                    className={getStatusColor(booking.status)}
                    variant="outline"
                  >
                    {booking.status.replace(/_/g, ' ')}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {getPaymentStatusIcon(booking.payment_status)}
                    <span className="text-sm text-gray-600">{booking.payment_status.replace(/_/g, ' ')}</span>
                  </div>
                  {booking.feedback && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Feedback Given
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-lg font-bold text-gray-900 mb-1">
                <DollarSign className="h-5 w-5 mr-1" />
                {parseFloat(booking.booked_fee).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Session Fee</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{startDateTime.date}</div>
                <div className="text-sm text-gray-600">Session Date</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {startDateTime.time} - {endDateTime.time}
                </div>
                <div className="text-sm text-gray-600">Session Time</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{booking.booked_timezone}</div>
                <div className="text-sm text-gray-600">Timezone</div>
              </div>
            </div>
          </div>
          {booking.mentor_profile_info.countries.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Countries:</span>
                {booking.mentor_profile_info.countries.map((country, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Show existing feedback if available */}
          {booking.feedback && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Your Feedback</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`h-4 w-4 ${
                          star <= booking.feedback.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-green-700">({booking.feedback.rating}/5)</span>
                </div>
                <p className="text-sm text-green-800 italic">"{booking.feedback.comment}"</p>
                <p className="text-xs text-green-600 mt-2">
                  Submitted on {new Date(booking.feedback.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t mt-4 border-gray-100">
            {isCancellable && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Session
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Session Cancellation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this session?
                      <br /><br />
                      <span dangerouslySetInnerHTML={{ __html: getCancellationPolicyMessage(booking) }} />
                      <br /><br />
                      This action cannot be undone, and the mentor will be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Session</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancelSession(booking.id)}>
                      Yes, Cancel It
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {isSessionActive && (
              <Button onClick={() => handleJoinCall(booking)} size="sm">
                <Video className="h-4 w-4 mr-2" />
                Join Session
              </Button>
            )}
            {showFeedbackButton && (
              <FeedbackDialog
                bookingId={booking.id}
                mentorName={mentorName}
                onFeedbackSubmitted={handleFeedbackSubmitted}
              >
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Give Feedback
                </Button>
              </FeedbackDialog>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (activeCallDetails) {
    return (
      <ZegoVideoCall 
        roomId={activeCallDetails.roomId}
        userId={activeCallDetails.userId}
        userName={activeCallDetails.userName}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeSection="Schedule" />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
              <p className="text-gray-600">View and manage your booked mentorship sessions</p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-8 h-auto p-1">
                {statusTabs.map((tab) => {
                  const count = paginationByStatus[tab.key].totalCount;
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.key}
                      value={tab.key}
                      className="flex flex-col items-center p-3 space-y-1 text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                      {count > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                          {count}
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {statusTabs.map((tab) => (
                <TabsContent key={tab.key} value={tab.key}>
                  <div className="space-y-6">
                    {/* Tab Header */}
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <tab.icon className="h-6 w-6 text-blue-600" />
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">{tab.label}</h2>
                          <p className="text-sm text-gray-600">{tab.description}</p>
                        </div>
                        {paginationByStatus[tab.key].totalCount > 0 && (
                          <div className="ml-auto">
                            <Badge variant="outline" className="text-sm">
                              {paginationByStatus[tab.key].totalCount} sessions
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    {isLoading[tab.key] && <LoadingSkeleton />}

                    {!isLoading[tab.key] && error && (
                      <Card className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Schedule</h3>
                        <p className="text-gray-600">{error}</p>
                        <Button 
                          onClick={() => fetchAndDistributeBookings(1, paginationByStatus['ALL'].pageSize)}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </Card>
                    )}

                    {!isLoading[tab.key] && !error && bookingsByStatus[tab.key].length === 0 && (
                      <EmptyState status={tab.key} tabInfo={tab} />
                    )}

                    {!isLoading[tab.key] && !error && bookingsByStatus[tab.key].length > 0 && (
                      <>
                        <div className="space-y-4">
                          {getPaginatedBookings(tab.key).map((booking) => (
                            <SessionCard key={booking.id} booking={booking} />
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-8">
                          <PaginationControls status={tab.key} />
                        </div>

                        {/* Session Summary for current page */}
                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-lg">Page Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {getPaginatedBookings(tab.key).length}
                                </div>
                                <div className="text-sm text-gray-600">Sessions (This Page)</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {getPaginatedBookings(tab.key).filter(b => b.status === 'CONFIRMED').length}
                                </div>
                                <div className="text-sm text-gray-600">Confirmed (This Page)</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                  ${getPaginatedBookings(tab.key).reduce((total, booking) => total + parseFloat(booking.booked_fee), 0).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">Total Value (This Page)</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Overall Statistics Card - Only show when ALL tab is active */}
            {activeTab === 'ALL' && !isLoading['ALL'] && !error && bookingsByStatus['ALL'].length > 0 && (
              <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">Overall Statistics</CardTitle>
                  <p className="text-blue-700">Your complete mentorship journey</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statusTabs.slice(1).map((tab) => {
                      const count = paginationByStatus[tab.key].totalCount;
                      const IconComponent = tab.icon;
                      return (
                        <div key={tab.key} className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{count}</div>
                          <div className="text-sm text-gray-600">{tab.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Schedule;