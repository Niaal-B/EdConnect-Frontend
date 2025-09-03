import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Ban, RefreshCw } from 'lucide-react';
import { SessionDetailsModal } from './SessionDetailsModal';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import api from '@/lib/api';

interface SessionTableProps {
  filterType: string;
  searchQuery: string;
  filters: any;
}

interface Session {
  id: string;
  student: number;
  mentor: number;
  slot: number;
  student_details: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    education_level: string;
    profile_picture: string | null;
  };
  mentor_details: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    profile_picture: string | null;
    bio: string;
    expertise: string[];
    experience_years: number;
  };
  booked_start_time: string;
  booked_end_time: string;
  booked_fee: string;
  booked_timezone: string;
  status: string;
  payment_status: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  slot_info: {
    id: number;
    start_time: string;
    end_time: string;
    fee: string;
    timezone: string;
    status: string;
  };
}

export const SessionTable = ({ filterType, searchQuery, filters }: SessionTableProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await api.get('admin/bookings/');
        setSessions(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.student_details.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.mentor_details.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.student_details.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.mentor_details.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilterType = 
      filterType === 'all' ||
      (filterType === 'confirmed' && session.status === 'CONFIRMED') ||
      (filterType === 'pending' && session.status === 'PENDING_PAYMENT') ||
      (filterType === 'canceled' && session.status.includes('CANCELED')) ||
      (filterType === 'completed' && session.status === 'COMPLETED') ||
      (filterType === 'refunded' && session.payment_status === 'REFUNDED');

    const matchesStatus = 
      filters.status === 'all' ||
      (filters.status === 'confirmed' && session.status === 'CONFIRMED') ||
      (filters.status === 'pending' && session.status === 'PENDING_PAYMENT') ||
      (filters.status === 'canceled_mentor' && session.status === 'CANCELED_BY_MENTOR') ||
      (filters.status === 'canceled_student' && session.status.includes('CANCELED_BY_STUDENT')) ||
      (filters.status === 'completed' && session.status === 'COMPLETED');

    const matchesPaymentStatus = 
      filters.paymentStatus === 'all' ||
      (filters.paymentStatus === 'paid' && session.payment_status === 'PAID') ||
      (filters.paymentStatus === 'pending' && session.payment_status === 'PENDING') ||
      (filters.paymentStatus === 'refunded' && session.payment_status === 'REFUNDED') ||
      (filters.paymentStatus === 'no_refund' && session.payment_status === 'NO_REFUND');

    return matchesSearch && matchesFilterType && matchesStatus && matchesPaymentStatus;
  });

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELED_BY_MENTOR':
      case 'CANCELED_BY_STUDENT_NO_REFUND':
      case 'CANCELED_BY_STUDENT_FULL_REFUND':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentBadgeColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NO_REFUND':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const handleCancelSession = (sessionId: string) => {
    console.log('Canceling session:', sessionId);
  };

  const handleRefundSession = (sessionId: string) => {
    console.log('Processing refund for session:', sessionId);
  };

  if (loading) {
    return <p className="p-4">Loading sessions...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Session Time</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-mono text-sm">
                  {session.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.student_details.profile_picture || ''} />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {session.student_details.user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {session.student_details.user.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.student_details.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.mentor_details.profile_picture || ''} />
                      <AvatarFallback className="bg-purple-500 text-white text-xs">
                        {session.mentor_details.user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {session.mentor_details.user.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.mentor_details.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(session.booked_start_time).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(session.booked_start_time).toLocaleTimeString()} - 
                      {new Date(session.booked_end_time).toLocaleTimeString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">${session.booked_fee}</span>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusBadgeColor(session.status)} text-xs`}>
                    {session.status.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${getPaymentBadgeColor(session.payment_status)} text-xs`}>
                    {session.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(session)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {session.status === 'CONFIRMED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}
                    {session.payment_status === 'PAID' && session.status.includes('CANCELED') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefundSession(session.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      <SessionDetailsModal
        session={selectedSession}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCancel={handleCancelSession}
        onRefund={handleRefundSession}
      />
    </Card>
  );
};
