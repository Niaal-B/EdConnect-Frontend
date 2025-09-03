import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, RotateCcw, FileText, Loader2 } from 'lucide-react';
import { DocumentReviewModal } from '@/components/admin/DocumentReviewModal';
import { getRejectedMentors, approveMentor, MentorApplication, rejectMentor } from '@/lib/api';

type Props = {
  refreshKey: number;
  onActionComplete: () => void;
};

export const RejectedApplications = ({ refreshKey, onActionComplete }: Props) => {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRejectedApplications = async () => {
    try {
      setLoading(true);
      const data = await getRejectedMentors();
      setApplications(data?.results || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch rejected applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedApplications();
  }, [refreshKey]);

  const handleReviewDocuments = (application: MentorApplication) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleReconsiderApprove = async (mentorId: string) => {
    try {
      setProcessing(`approve-${mentorId}`);
      await approveMentor(mentorId);
      toast({
        title: 'Success',
        description: 'Mentor approved successfully',
      });
      onActionComplete(); 
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve mentor',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
      setShowModal(false);
    }
  };

  const handleReject = async (mentorId: string, reason: string) => {
    try {
      setProcessing(`reject-${mentorId}`);
      console.log(reason, "this is the reason before calling the function");
      await rejectMentor(mentorId, reason);
      toast({
        title: 'Success',
        description: 'Mentor rejected successfully',
      });
      onActionComplete(); 
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject mentor',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
      setShowModal(false);
    }
  };

  const handleQuickApprove = async (mentorId: string) => {
    await handleReconsiderApprove(mentorId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No rejected mentor applications</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={application.profile_picture || undefined} />
                  <AvatarFallback className="bg-red-500 text-white">
                    {application?.email?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.email}
                    </h3>
                    <Badge className="bg-red-100 text-red-800">
                      Rejected
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{application?.email}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Rejected: {new Date(application?.last_status_update).toLocaleDateString()}
                  </p>

                  {application.rejection_reason && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {application.rejection_reason}
                      </p>
                    </div>
                  )}

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Expertise Areas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {application.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Experience:</h4>
                    <p className="text-sm text-gray-600">
                      {application.experience_years} years of experience
                    </p>
                    {application.bio && (
                      <p className="text-sm text-gray-600 mt-1">{application.bio}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span>
                      Documents: {application.documents.map(d => d.document_type).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReviewDocuments(application)}
                  className="flex items-center gap-2"
                  disabled={!!processing}
                >
                  <Eye className="h-4 w-4" />
                  Review Documents
                </Button>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleQuickApprove(application.id)}
                    disabled={!!processing}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    {processing === `approve-${application.id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewDocuments(application)}
                    disabled={!!processing}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reconsider
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <DocumentReviewModal
        application={selectedApplication}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onApprove={handleReconsiderApprove}
        onReject={handleReject}
        processing={processing}
        isRejectedView={true} 
      />
    </div>
  );
};