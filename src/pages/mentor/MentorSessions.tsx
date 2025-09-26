import React, { useState, useEffect } from 'react';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Video,
  Mail,
  XCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  CreditCard,
  CheckCheck,
  Ban,
} from 'lucide-react';
import api from '@/lib/api';
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

import ZegoVideoCall from '@/components/ZegoVideoCall';

interface UserData {
  id: number;
  email: string;
  username: string;
  role: string;
  profile_picture: string;
}

interface StudentUser {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
  mentor_profile: string | null;
}

interface StudentProfileInfo {
  id: number;
  user: StudentUser;
  education_level: string;
  fields_of_interest: string[];
  mentorship_preferences: string[];
  preferred_countries: string[];
  interested_universities: string[];
  additional_notes: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

interface SlotInfo {
  id: number;
  start_time: string;
  end_time: string;
  fee: string;
  timezone: string;
  status: string;
}

interface BookedSession {
  id: string;
  student: number;
  mentor: number;
  slot: number;
  student_profile_info: StudentProfileInfo;
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
  created_at: string;
  updated_at: string;
}

interface BookedSessionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookedSession[];
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

type SessionStatus = 'ALL' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED_BY_STUDENT_FULL_REFUND' | 'CANCELED_BY_STUDENT_NO_REFUND' | 'CANCELED_BY_MENTOR';

const MentorSessions = () => {
  const [sessionsByStatus, setSessionsByStatus] = useState<Record<SessionStatus, BookedSession[]>>({
    ALL: [],
    PENDING_PAYMENT: [],
    CONFIRMED: [],
    COMPLETED: [],
    CANCELED_BY_STUDENT_FULL_REFUND: [],
    CANCELED_BY_STUDENT_NO_REFUND: [],
    CANCELED_BY_MENTOR: [],
  });
  
  const [isLoading, setIsLoading] = useState<Record<SessionStatus, boolean>>({
    ALL: true,
    PENDING_PAYMENT: false,
    CONFIRMED: false,
    COMPLETED: false,
    CANCELED_BY_STUDENT_FULL_REFUND: false,
    CANCELED_BY_STUDENT_NO_REFUND: false,
    CANCELED_BY_MENTOR: false,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SessionStatus>('ALL');
  
  const [paginationByStatus, setPaginationByStatus] = useState<Record<SessionStatus, PaginationInfo>>({
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
      key: 'ALL' as SessionStatus, 
      label: 'All Sessions', 
      icon: Calendar,
      description: 'All your scheduled sessions'
    },
    { 
      key: 'PENDING_PAYMENT' as SessionStatus, 
      label: 'Pending Payment', 
      icon: CreditCard,
      description: 'Sessions awaiting student payment'
    },
    { 
      key: 'CONFIRMED' as SessionStatus, 
      label: 'Confirmed', 
      icon: CheckCircle,
      description: 'Confirmed and upcoming sessions'
    },
    { 
      key: 'COMPLETED' as SessionStatus, 
      label: 'Completed', 
      icon: CheckCheck,
      description: 'Successfully completed sessions'
    },
    { 
      key: 'CANCELED_BY_STUDENT_FULL_REFUND' as SessionStatus, 
      label: 'Student Cancelled', 
      icon: Ban,
      description: 'Student cancelled with refund'
    },
    { 
      key: 'CANCELED_BY_STUDENT_NO_REFUND' as SessionStatus, 
      label: 'Student Cancelled', 
      icon: XCircle,
      description: 'Student cancelled without refund'
    },
    { 
      key: 'CANCELED_BY_MENTOR' as SessionStatus, 
      label: 'Mentor Cancelled', 
      icon: AlertCircle,
      description: 'Sessions you cancelled'
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

  // Function to fetch all sessions and distribute them by status
  const fetchAndDistributeSessions = async (page: number = 1, pageSize: number = 10) => {
    setIsLoading(prev => ({ ...prev, ALL: true }));
    setError(null);
    
    try {
      const response = await api.get<BookedSessionsResponse>(`bookings/mentor-bookings?page=${page}&page_size=${pageSize}`);
      
      let allSessions = [];
      
      if (Array.isArray(response.data)) {
        allSessions = response.data;
      } else if (response.data && 'results' in response.data) {
        allSessions = response.data.results;
      }
      
      // Distribute sessions by status
      const sessionsByStatusMap: Record<SessionStatus, BookedSession[]> = {
        ALL: allSessions,
        PENDING_PAYMENT: allSessions.filter(s => s.status === 'PENDING_PAYMENT'),
        CONFIRMED: allSessions.filter(s => s.status === 'CONFIRMED'),
        COMPLETED: allSessions.filter(s => s.status === 'COMPLETED'),
        CANCELED_BY_STUDENT_FULL_REFUND: allSessions.filter(s => s.status === 'CANCELED_BY_STUDENT_FULL_REFUND'),
        CANCELED_BY_STUDENT_NO_REFUND: allSessions.filter(s => s.status === 'CANCELED_BY_STUDENT_NO_REFUND'),
        CANCELED_BY_MENTOR: allSessions.filter(s => s.status === 'CANCELED_BY_MENTOR'),
      };
      
      setSessionsByStatus(sessionsByStatusMap);
      
      // Update pagination for all statuses
      const newPagination: Record<SessionStatus, PaginationInfo> = {};
      Object.keys(sessionsByStatusMap).forEach((statusKey) => {
        const status = statusKey as SessionStatus;
        const count = sessionsByStatusMap[status].length;
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
      
    } catch (error) {
      console.error("Failed to fetch and distribute sessions:", error);
      setError("Failed to load sessions. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load sessions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, ALL: false }));
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAndDistributeSessions(1, 10);
  }, []);

  const handleTabChange = (newStatus: SessionStatus) => {
    setActiveTab(newStatus);
    // All data is already loaded and filtered, no need to fetch again
  };

  const handlePageChange = (status: SessionStatus, newPage: number) => {
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

  const handlePageSizeChange = (status: SessionStatus, newPageSize: number) => {
    const statusSessions = sessionsByStatus[status];
    const totalPages = Math.max(1, Math.ceil(statusSessions.length / newPageSize));
    
    setPaginationByStatus(prev => ({
      ...prev,
      [status]: {
        currentPage: 1,
        totalPages,
        pageSize: newPageSize,
        totalCount: statusSessions.length,
        hasNext: totalPages > 1,
        hasPrevious: false,
      }
    }));
  };

  // Get paginated sessions for current tab
  const getPaginatedSessions = (status: SessionStatus) => {
    const allStatusSessions = sessionsByStatus[status];
    const pagination = paginationByStatus[status];
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return allStatusSessions.slice(startIndex, endIndex);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSessionDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    return `${minutes} min`;
  };

  const getStatusColor = (status: BookedSession['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'CANCELED_BY_STUDENT_FULL_REFUND':
      case 'CANCELED_BY_STUDENT_NO_REFUND':
      case 'CANCELED_BY_MENTOR':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPaymentStatusColor = (status: BookedSession['payment_status']) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'NO_REFUND':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleCancelSession = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel/`, { reason: 'Mentor cancelled session' });
      toast({
        title: "Session Cancelled",
        description: "The session has been successfully cancelled and the student will be notified.",
        variant: "default",
      });
      // Refresh data after cancellation
      fetchAndDistributeSessions(1, paginationByStatus['ALL'].pageSize);
    } catch (error: any) {
      console.error('Error cancelling session:', error);
      const errorMessage = error.response?.data?.detail || "An unexpected error occurred.";
      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleJoinCall = (session: BookedSession) => {
    const roomId = session.id;
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

  // Pagination component for a specific status
  const PaginationControls = ({ status }: { status: SessionStatus }) => {
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
  const EmptyState = ({ status, tabInfo }: { status: SessionStatus; tabInfo: any }) => (
    <Card className="p-12 text-center">
      <tabInfo.icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No {status === 'ALL' ? 'Sessions' : tabInfo.label}
      </h3>
      <p className="text-gray-600 mb-6">{tabInfo.description}</p>
    </Card>
  );

  // Session card component
  const SessionCard = ({ session }: { session: BookedSession }) => {
    const isCancellable = session.status === 'CONFIRMED' && new Date(session.booked_start_time) > new Date();
    const sessionStartTime = new Date(session.booked_start_time);
    const now = new Date();
    const isSessionActive = 
        session.status === 'CONFIRMED' &&
        now <= new Date(sessionStartTime.getTime() - 10 * 60000) &&
        now <= new Date(session.booked_end_time);
    return (
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={session.student_profile_info.profile_picture || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {session.student_profile_info.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-foreground">
                  {session.student_profile_info.user.username}
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {session.student_profile_info.user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(session.status)}>
                {session.status.replace(/_/g, ' ')}               
              </Badge>
              <Badge className={getPaymentStatusColor(session.payment_status)}>
                {session.payment_status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(session.booked_start_time)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(session.booked_start_time)} - {formatTime(session.booked_end_time)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({getSessionDuration(session.booked_start_time, session.booked_end_time)})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Fee</p>
                <p className="text-sm text-muted-foreground">${session.booked_fee}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Student Level</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {session.student_profile_info.education_level.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            {isSessionActive && (
              <Button size="sm" onClick={() => handleJoinCall(session)}>
                <Video className="h-4 w-4 mr-2" />
                Join Session
              </Button>
            )}
            {isCancellable && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Session
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Cancelling this session will initiate a refund process for the student (full refund will be issued as per mentor cancellation policy). The student will be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Dismiss</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancelSession(session.id)}>
                      Yes, Cancel Session
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
    <MentorDashboardLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
          <p className="text-gray-600">View and manage your mentorship sessions</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Sessions</h3>
                    <p className="text-gray-600">{error}</p>
                    <Button 
                      onClick={() => fetchAndDistributeSessions(1, paginationByStatus['ALL'].pageSize)}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </Card>
                )}

                {!isLoading[tab.key] && !error && sessionsByStatus[tab.key].length === 0 && (
                  <EmptyState status={tab.key} tabInfo={tab} />
                )}

                {!isLoading[tab.key] && !error && sessionsByStatus[tab.key].length > 0 && (
                  <>
                    <div className="grid gap-6">
                      {getPaginatedSessions(tab.key).map((session) => (
                        <SessionCard key={session.id} session={session} />
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {getPaginatedSessions(tab.key).length}
                            </div>
                            <div className="text-sm text-gray-600">Sessions (This Page)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {getPaginatedSessions(tab.key).filter(s => s.status === 'CONFIRMED').length}
                            </div>
                            <div className="text-sm text-gray-600">Confirmed (This Page)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {getPaginatedSessions(tab.key).filter(s => s.status === 'COMPLETED').length}
                            </div>
                            <div className="text-sm text-gray-600">Completed (This Page)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              ${getPaginatedSessions(tab.key).reduce((total, session) => total + parseFloat(session.booked_fee), 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Earnings (This Page)</div>
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
        {activeTab === 'ALL' && !isLoading['ALL'] && !error && sessionsByStatus['ALL'].length > 0 && (
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
              
              {/* Additional mentor-specific stats */}
              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      ${sessionsByStatus['ALL']
                        .filter(s => s.status === 'COMPLETED' || s.status === 'CONFIRMED')
                        .reduce((total, session) => total + parseFloat(session.booked_fee), 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Potential Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {sessionsByStatus['ALL']
                        .filter(s => s.status === 'COMPLETED')
                        .reduce((total, session) => {
                          const start = new Date(session.booked_start_time);
                          const end = new Date(session.booked_end_time);
                          return total + (end.getTime() - start.getTime()) / (1000 * 60);
                        }, 0)} min
                    </div>
                    <div className="text-sm text-gray-600">Total Mentorship Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {new Set(sessionsByStatus['ALL'].map(s => s.student)).size}
                    </div>
                    <div className="text-sm text-gray-600">Unique Students Mentored</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorSessions;