import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Ban, RefreshCw, Calendar, Clock, DollarSign, User, Mail, GraduationCap } from 'lucide-react';

interface SessionDetailsModalProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (sessionId: string) => void;
  onRefund: (sessionId: string) => void;
}

export const SessionDetailsModal = ({
  session,
  isOpen,
  onClose,
  onCancel,
  onRefund,
}: SessionDetailsModalProps) => {
  if (!session) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Session ID: {session.id}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Status and Payment */}
          <div className="flex gap-4">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Session Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getStatusBadgeColor(session.status)}`}>
                  {session.status.replace(/_/g, ' ')}
                </Badge>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getPaymentBadgeColor(session.payment_status)}`}>
                  {session.payment_status}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Session Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Start Time</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.booked_start_time).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">End Time</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.booked_end_time).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Fee</div>
                    <div className="text-sm text-muted-foreground">
                      ${session.booked_fee}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Timezone</div>
                  <div className="text-sm text-muted-foreground">
                    {session.booked_timezone}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student and Mentor Information */}
          <div className="grid grid-cols-2 gap-4">
            {/* Student Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Student
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.student_details.profile_picture} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {session.student_details.user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {session.student_details.user.username}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {session.student_details.user.email}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Education Level</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {session.student_details.education_level.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Mentor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.mentor_details.profile_picture} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {session.mentor_details.user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {session.mentor_details.user.username}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {session.mentor_details.user.email}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Experience</div>
                    <div className="text-sm text-muted-foreground">
                      {session.mentor_details.experience_years} years
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Bio</div>
                    <div className="text-sm text-muted-foreground">
                      {session.mentor_details.bio || 'No bio provided'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Stripe Checkout Session</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {session.stripe_checkout_session_id}
                  </div>
                </div>
                {session.stripe_payment_intent_id && (
                  <div>
                    <div className="text-sm font-medium">Payment Intent</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {session.stripe_payment_intent_id}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Created At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Updated At</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {session.status === 'CONFIRMED' && (
            <Button
              variant="destructive"
              onClick={() => {
                onCancel(session.id);
                onClose();
              }}
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancel Session
            </Button>
          )}
          {session.payment_status === 'PAID' && session.status.includes('CANCELED') && (
            <Button
              onClick={() => {
                onRefund(session.id);
                onClose();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Refund
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};