import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, UserX, FileText, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const getVerifiedMentors = async () => {
  const response = await api.get(`admin/mentors/verified/`, {
    withCredentials: true,
  });
  return response.data.results;
};

export const VerifiedMentors = () => {
  const [verifiedMentors, setVerifiedMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await getVerifiedMentors();
        setVerifiedMentors(data);
      } catch (error) {
        console.error('Failed to fetch verified mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  const openDialog = (mentor: any) => {
    setSelectedMentor(mentor);
    setIsDialogOpen(true);
  };

  const getLastUploadedDocument = (documents: any[]) => {
    if (!documents || documents.length === 0) return null;

    return documents[documents.length - 1];
  };

  const handleDocumentView = (document: any) => {
    const documentUrl = document.document || document.file;
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  return (
    <>
      <div className="space-y-4">
        {verifiedMentors.map((mentor: any) => (
          <Card key={mentor.id} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mentor.profile_picture} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {mentor.full_name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {mentor.full_name}
                      </h3>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                    <p className="text-gray-600 mb-1">{mentor.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openDialog(mentor)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for Profile View */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mentor Profile</DialogTitle>
            <DialogDescription>Detailed mentor information</DialogDescription>
          </DialogHeader>

          {selectedMentor && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMentor.profile_picture} />
                  <AvatarFallback>
                    {selectedMentor.full_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedMentor.full_name}
                  </h2>
                  <p className="text-sm text-gray-600">{selectedMentor.email}</p>
                </div>
              </div>

              <div className="text-sm space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-gray-600">{selectedMentor.phone || 'Not provided'}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Bio:</span>
                  <p className="mt-1 text-gray-600">{selectedMentor.bio || 'No bio provided'}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="ml-2 text-gray-600">{selectedMentor.experience_years} years</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-gray-600">{selectedMentor.verification_status}</span>
                </div>
                
                {selectedMentor.expertise?.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Expertise:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedMentor.expertise.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-700">Last Status Update:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedMentor.last_status_update).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Documents Section */}
              <div className="border-t pt-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Documents</h3>
                {selectedMentor.documents && selectedMentor.documents.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      Total documents: {selectedMentor.documents.length}
                    </p>
                    
                    {/* Show last uploaded document */}
                    {(() => {
                      const lastDoc = getLastUploadedDocument(selectedMentor.documents);
                      return lastDoc ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Latest Document
                                </p>
                                <p className="text-xs text-gray-500">
                                  {lastDoc.document_type || 'Document'} (ID: {lastDoc.id})
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDocumentView(lastDoc)}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Show all documents list */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">All Documents:</p>
                      <div className="space-y-1">
                        {selectedMentor.documents.map((doc: any, index: number) => (
                          <div key={doc.id} className="flex items-center justify-between py-2 px-3 bg-white border border-gray-100 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {doc.document_type || `Document ${index + 1}`}
                              </span>
                              <span className="text-xs text-gray-400">(ID: {doc.id})</span>
                            </div>
                            
                            {(doc.document || doc.file) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDocumentView(doc)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span className="text-xs">View</span>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};