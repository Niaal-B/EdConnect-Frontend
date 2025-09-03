import { useState, useEffect } from "react";
import { Camera, Upload, CheckCircle, Clock, XCircle, Save, FileText, X, Download, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import MentorDashboardLayout from "@/components/MentorDashboardLayout";
import { mentorApi } from "@/lib/api";

type Document = {
  id: number;
  document_type: string;
  file: string;
  uploaded_at: string;
  is_approved: boolean;
  rejection_reason?: string;
};

type MentorProfile = {
  bio: string;
  phone: string;
  expertise: Record<string, string>;
  experience_years: number;
  is_verified: boolean;
  profile_picture: string;
  documents: Document[];
  fullName?: string;
  email?: string;
  countries: string[];
  courses: string[];
  verification_status?: string;
  rejection_reason?: string;
};

const MentorProfile = () => {
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string>("");
  const [profileData, setProfileData] = useState<MentorProfile>({
    bio: '',
    phone: '',
    expertise: {},
    experience_years: 0,
    is_verified: false,
    profile_picture: '',
    documents: [],
    countries: [],
    courses: []
  });
  const [newCountry, setNewCountry] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await mentorApi.getProfile();
      setProfileData({
        ...response.data,
        countries: Array.isArray(response.data.countries) ? response.data.countries : [],
        courses: Array.isArray(response.data.courses) ? response.data.courses : []
      });
      setProfileImage(response.data.profile_picture);
      
      // Determine verification status based on response data
      if (response.data.is_verified) {
        setVerificationStatus('verified');
      } else if (response.data.verification_status === 'rejected') {
        setVerificationStatus('rejected');
      } else {
        setVerificationStatus('pending');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await mentorApi.updateProfile({
        bio: profileData.bio,
        phone: profileData.phone,
        expertise: profileData.expertise,
        experience_years: profileData.experience_years,
        countries: profileData.countries,
        courses: profileData.courses
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Update error:", error);
      
      let errorMessage = "Failed to update profile";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpertiseChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        [field]: value
      }
    }));
  };

  const handleAddCountry = () => {
    if (newCountry.trim() && !profileData.countries.includes(newCountry.trim())) {
      setProfileData(prev => ({
        ...prev,
        countries: [...prev.countries, newCountry.trim()]
      }));
      setNewCountry('');
    }
  };

  const handleRemoveCountry = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      countries: prev.countries.filter((_, i) => i !== index)
    }));
  };

  const handleAddCourse = () => {
    if (newCourse.trim() && !profileData.courses.includes(newCourse.trim())) {
      setProfileData(prev => ({
        ...prev,
        courses: [...prev.courses, newCourse.trim()]
      }));
      setNewCourse('');
    }
  };

  const handleRemoveCourse = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or GIF image",
        variant: "destructive",
      });
      return;
    }
  
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setUploadingImage(true);
      
      const response = await mentorApi.updateProfilePicture(file);
      
      setProfileImage(response.data.profile_picture);
      setProfileData(prev => ({
        ...prev,
        profile_picture: response.data.profile_picture
      }));
      
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error: any) {
      console.error("Image upload error:", error);
      
      let errorMessage = "Failed to upload image";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const validTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const invalidFiles = Array.from(files).filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !validTypes.includes(extension);
    });
  
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file types",
        description: "Please upload only PDF, JPG, or PNG files",
        variant: "destructive",
      });
      return;
    }
  
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: "Maximum file size is 10MB per file",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setUploadingDocuments(true);
      
      const response = await mentorApi.uploadDocuments(Array.from(files));
      
      if (response.data.document) {
        setProfileData(prev => ({
          ...prev,
          documents: [
            ...(Array.isArray(prev.documents) ? prev.documents : []),
            {
              id: response.data.document.id,
              file: response.data.document.file,
              document_type: response.data.document.document_type,
              uploaded_at: new Date().toISOString(),
              is_approved: false
            }
          ]
        }));
      } else if (response.data.documents && Array.isArray(response.data.documents)) {
        setProfileData(prev => ({
          ...prev,
          documents: [
            ...(Array.isArray(prev.documents) ? prev.documents : []),
            ...response.data.documents.map(doc => ({
              id: doc.id,
              file: doc.file,
              document_type: doc.document_type,
              uploaded_at: doc.uploaded_at || new Date().toISOString(),
              is_approved: doc.is_approved || false,
              rejection_reason: doc.rejection_reason || null
            }))
          ]
        }));
      }
      
      setVerificationStatus('pending');
      
      toast({
        title: "Documents Uploaded",
        description: `${files.length} document(s) uploaded successfully. Waiting for verification.`,
      });
    } catch (error: any) {
      console.error("Document upload error:", error);
      
      let errorMessage = "Failed to upload documents";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploadingDocuments(false);
      if (event.target) event.target.value = '';
    }
  };

  const removeDocument = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleDownloadDocument = (document: Document) => {
    try {
      const link = document.createElement('a');
      link.href = document.file;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      const fileName = document.file.split('/').pop()?.split('?')[0] || 
                      `${document.document_type || 'document'}.pdf`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(document.file, '_blank');
    }
  };
  
  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const getDocumentTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      'ID': 'ID Proof',
      'TRANSCRIPT': 'Academic Transcript',
      'ENROLLMENT': 'Enrollment Certificate',
      'RESUME': 'Resume/CV',
      'CERTIFICATION': 'Professional Certification',
      'DEGREE': 'Degree Certificate'
    };
    return typeMap[type] || type;
  };

  function formatFileName(url: string): string {
    try {
      const fullName = url.split('/').pop() || '';
      const match = fullName.match(/^(.+?\.(pdf|docx?|jpeg|jpg|png))/i);
      return match ? match[1] : 'Unknown File';
    } catch {
      return 'Invalid File';
    }
  }
  
  
  const getDocumentStatusBadge = (doc: Document) => {
    if (doc.is_approved) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
    } else if (doc.rejection_reason) {
      return <Badge variant="destructive">Rejected</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
    }
  };

  return (
    <MentorDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Profile</h1>
          <p className="text-gray-500 mt-1">Manage your profile information and verification documents</p>
        </div>

        <div className="space-y-6">
          {/* Overall Verification Status Alert */}
          {verificationStatus === 'rejected' && profileData.rejection_reason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Account Verification Rejected:</strong> {profileData.rejection_reason}
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Personal Information
                {getStatusIcon()}
                {getStatusBadge()}
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {uploadingImage ? (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100">
                      <Clock className="h-6 w-6 text-gray-400 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage 
                        src={profileImage || profileData.profile_picture} 
                        alt="Profile" 
                        onError={(e) => {
                          e.currentTarget.src = '/default-profile.png';
                        }}
                      />
                      <AvatarFallback>
                        {profileData.fullName?.split(' ').map(n => n[0]).join('') || 'M'}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      disabled={uploadingImage}
                      asChild
                    >
                      <span>
                        {uploadingImage ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera className="h-4 w-4" />
                            Change Photo
                          </>
                        )}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(profileData.expertise).map(([field, value]) => (
                  <div className="space-y-2" key={field}>
                    <Label htmlFor={`expertise-${field}`}>
                      Expertise
                    </Label>
                    <Input
                      id={`expertise-${field}`}
                      value={value}
                      onChange={(e) => handleExpertiseChange(field, e.target.value)}
                      placeholder={`e.g., ${field === 'python' ? 'Django, Flask' : 'Machine Learning, Data Science'}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Your professional background information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    min="0"
                    max="50"
                    value={profileData.experience_years}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
              <CardDescription>
                Specify the countries and courses you specialize in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Countries Section */}
              <div className="space-y-4">
                <div>
                  <Label>Countries</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Add countries you're qualified to mentor students from
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      placeholder="e.g., US, UK, IN"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddCountry}
                      disabled={!newCountry.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {profileData.countries.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profileData.countries.map((country, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {country}
                        <button 
                          type="button"
                          onClick={() => handleRemoveCountry(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Courses Section */}
              <div className="space-y-4">
                <div>
                  <Label>Courses</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Add courses you're qualified to teach
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      placeholder="e.g., Computer Science, Data Science"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCourse()}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddCourse}
                      disabled={!newCourse.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {profileData.courses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profileData.courses.map((course, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {course}
                        <button 
                          type="button"
                          onClick={() => handleRemoveCourse(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
              <CardDescription>
                Upload and manage your verification documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Upload */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documents" className="text-sm font-medium">
                    Upload New Documents
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Upload ID proof, degree certificates, and professional certifications (PDF, JPG, PNG - max 10MB each)
                  </p>
                  <Label htmlFor="documents" className="cursor-pointer">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      uploadingDocuments 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {uploadingDocuments ? (
                        <>
                          <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2 animate-spin" />
                          <p className="text-sm font-medium text-blue-600">Uploading documents...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm font-medium">Click to upload documents</p>
                          <p className="text-xs text-gray-500">or drag and drop files here</p>
                        </>
                      )}
                    </div>
                  </Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleDocumentUpload}
                    disabled={uploadingDocuments}
                  />
                </div>
              </div>

              {/* Uploaded Documents Display */}
              {profileData.documents && profileData.documents.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Your Documents</Label>
                    <p className="text-xs text-gray-500">
                      {profileData.documents.length} document(s) uploaded
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profileData.documents.map((doc, index) => (
                      <Card key={doc.id || index} className="border">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Document Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {getDocumentTypeName(doc.document_type)}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate">
                                    {formatFileName(doc.file)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(index)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Document Status */}
                            <div className="space-y-2">                              
                              {/* Rejection Reason */}
                              {doc.rejection_reason && (
                                <Alert variant="destructive" className="mt-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription className="text-xs">
                                    <strong>Rejection Reason:</strong><br />
                                    {doc.rejection_reason}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>

                            {/* Document Info */}
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadDocument(doc)}
                                className="flex-1 text-xs"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Verification Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Verification Status</h4>
                  {getStatusBadge()}
                </div>
                
                {verificationStatus === 'pending' && (
                  <p className="text-sm text-gray-600">
                    {profileData.documents?.length > 0 
                      ? "Documents uploaded successfully. Our team will review them within 2-3 business days."
                      : "Please upload verification documents to complete your profile."}
                  </p>
                )}
                
                {verificationStatus === 'verified' && (
                  <div className="space-y-1">
                    <p className="text-sm text-green-600 font-medium">Your account is verified!</p>
                    <p className="text-xs text-gray-500">
                      You can now accept mentorship requests and start earning.
                    </p>
                  </div>
                )}
                
                {verificationStatus === 'rejected' && (
                  <div className="space-y-1">
                    <p className="text-sm text-red-600 font-medium">Verification rejected</p>
                    <p className="text-xs text-gray-500">
                      Please review the rejection reasons above, upload better documents, and contact support if needed.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              className="bg-bridgeblue-500 hover:bg-bridgeblue-600"
              disabled={isSubmitting || uploadingImage || uploadingDocuments}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorProfile;