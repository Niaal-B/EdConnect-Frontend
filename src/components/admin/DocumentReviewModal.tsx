import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Document {
  id: number;
  document_type: string;
  file: string;
  uploaded_at: string;
  is_approved: boolean;
}

interface MentorApplication {
  id: number;
  full_name: string;
  email: string;
  bio: string;
  phone: string;
  expertise: string[];
  experience_years: number;
  is_verified: boolean;
  verification_status: string;
  rejection_reason: string | null;
  profile_picture: string | null;
  documents: Document[];
  created_at: string;
}

interface DocumentReviewModalProps {
  application: MentorApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  processing: string | null;
}

export const DocumentReviewModal = ({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  processing,
}: DocumentReviewModalProps) => {
  const [isClient, setIsClient] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setReviewNotes('');
    }
  }, [isOpen]);

  if (!application) return null;

  const handleDownload = (document: Document) => {
    if (!isClient) return;
    try {
      const link = document.createElement('a');
      link.href = document.file;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const fileName = document.file.split('/').pop()?.split('?')[0] || `${document.document_type || 'document'}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(document.file, '_blank');
    }
  };

  const getDocumentTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      ID: 'ID Proof',
      TRANSCRIPT: 'Transcript',
      ENROLLMENT: 'Enrollment Proof',
      RESUME: 'Resume',
      CERTIFICATION: 'Certification',
    };
    return typeMap[type] || type;
  };

  const getDocumentColor = (type: string) => {
    const colorMap: Record<string, string> = {
      ID: 'text-purple-600',
      TRANSCRIPT: 'text-blue-600',
      ENROLLMENT: 'text-green-600',
      RESUME: 'text-orange-600',
      CERTIFICATION: 'text-teal-600',
    };
    return colorMap[type] || 'text-gray-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Mentor Application</DialogTitle>
          <DialogDescription>
            Review and verify the mentor's documents and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mentor Info */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={application.profile_picture || undefined} />
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {application.full_name
                  ? application.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  : application.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {application.full_name || 'No name provided'}
              </h3>
              <p className="text-gray-600 mb-2">{application.email}</p>
              <p className="text-sm text-gray-500 mb-3">
                Application ID: {application.id} | Submitted:{' '}
                {new Date(application.created_at).toLocaleDateString()}
              </p>

              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise Areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {application.expertise.length > 0 ? (
                    application.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No expertise listed</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Experience:</h4>
                <p className="text-sm text-gray-600">
                  {application.experience_years} years of experience
                </p>
                {application.bio && (
                  <p className="text-sm text-gray-600 mt-1">{application.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>

            {application.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {application.documents.map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className={`h-5 w-5 ${getDocumentColor(document.document_type)}`} />
                        <span className="font-medium">
                          {getDocumentTypeName(document.document_type)}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(document)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-gray-100 h-32 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Document Preview</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                      {document.is_approved && (
                        <span className="ml-2 text-green-600">✓ Approved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No documents uploaded</p>
              </div>
            )}
          </div>

          {/* Review Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Notes</h3>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add your review comments here... (Required for rejection)"
              className="min-h-20"
            />
            {reviewNotes.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">{reviewNotes.length} characters</p>
            )}
          </div>

          {/* Action Buttons with Confirmation Dialogs */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={!!processing}>
              Cancel
            </Button>

            {/* Reject with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!!processing}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {processing === `reject-${application.id}` ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject Application
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this application? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (!reviewNotes.trim()) {
                        alert('Please provide a reason for rejection');
                        return;
                      }
                      onReject(application.id, reviewNotes.trim());
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Approve with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!!processing} className="bg-green-600 hover:bg-green-700">
                  {processing === `approve-${application.id}` ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve & Verify
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve and verify this mentor?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onApprove(application.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
