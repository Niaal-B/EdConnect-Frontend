import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CreditCard, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudentProfile, updateStudentProfile, uploadProfilePicture } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    user: {
      username: '',
      email: '',
    },
    education_level: '',
    fields_of_interest: [],
    preferred_countries: [],
    interested_universities: [],
    mentorship_preferences: [],
    profile_picture: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setProfile(data);
        console.log(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setProfile(prev => {
      if (typeof value === 'string') {
        return {
          ...prev,
          [field]: field.includes('_') ? 
            value.split(',').map(item => item.trim()) : 
            value
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type and size
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPG, PNG, or GIF image',
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB',
          variant: 'destructive',
        });
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('profile_picture', file);
        
        const updatedProfile = await uploadProfilePicture(formData);
        setProfile(prev => ({
          ...prev,
          profile_picture: updatedProfile.profile_picture
        }));
        toast({
          title: 'Success',
          description: 'Profile picture updated successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload profile picture',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };


  const handleLogout = async () => {
    try {
      const res = await api.post("user/logout/");
  
      if (res.status === 200) {
        navigate("/student/login"); // Redirect to student login after logout
      } else {
        console.error("Logout failed with status", res.status);
      }
    } catch (error) {
      console.error("Logout error", error);
      toast({
        title: "Logout failed",
        description: "Something went wrong while logging out.",
        variant: "destructive",
      });
    }
  };
  

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSend = {
        ...profile,
        education_level: Array.isArray(profile.education_level) 
          ? profile.education_level[0] // Ensure it’s a single string
          : profile.education_level,
        fields_of_interest: Array.isArray(profile.fields_of_interest) 
          ? profile.fields_of_interest 
          : profile.fields_of_interest.split(',').map(item => item.trim()),
        preferred_countries: Array.isArray(profile.preferred_countries) 
          ? profile.preferred_countries 
          : profile.preferred_countries.split(',').map(item => item.trim()),
        interested_universities: Array.isArray(profile.interested_universities) 
          ? profile.interested_universities 
          : profile.interested_universities.split(',').map(item => item.trim()),
      };

      await updateStudentProfile(dataToSend);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="rounded-xl hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 ring-4 ring-blue-100">
                    {profile.profile_picture ? (
                      <AvatarImage 
                        src={profile.profile_picture} 
                        alt={`${profile.user.username}'s profile`}
                      />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                      {profile.user.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        'Change Photo'
                      )}
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 5MB</p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.user.username} 
                      onChange={(e) => handleInputChange('user', {
                        ...profile.user,
                        username: e.target.value
                      })}
                      className="mt-1 rounded-xl" 
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.user.last_name}
                      onChange={(e) => handleInputChange('user', {
                        ...profile.user,
                        last_name: e.target.value
                      })}
                      className="mt-1 rounded-xl" 
                    />
                  </div> */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.user.email}
                      readOnly
                      className="mt-1 rounded-xl bg-gray-100" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Educational Level</Label>
                    <Input 
                      id="level" 
                      value={profile.education_level}
                      onChange={(e) => handleInputChange('education_level', e.target.value)}
                      className="mt-1 rounded-xl" 
                    />
                  </div>
                </div>

                {/* Fields of Interest */}
                <div>
                  <Label htmlFor="interests">Fields of Interest</Label>
                  <Input 
                    id="interests" 
                    value={Array.isArray(profile.fields_of_interest) ? 
                      profile.fields_of_interest.join(', ') : 
                      profile.fields_of_interest}
                    onChange={(e) => handleInputChange('fields_of_interest', e.target.value)}
                    placeholder="Add your interests..."
                    className="mt-1 rounded-xl" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mentorship Preferences */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Mentorship Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredCountries">Preferred Study Countries</Label>
                  <Input 
                    id="preferredCountries" 
                    value={Array.isArray(profile.preferred_countries) ? 
                      profile.preferred_countries.join(', ') : 
                      profile.preferred_countries}
                    onChange={(e) => handleInputChange('preferred_countries', e.target.value)}
                    placeholder="Countries you want to study in..."
                    className="mt-1 rounded-xl" 
                  />
                </div>
                <div>
                  <Label htmlFor="interestedUniversities">Interested Universities</Label>
                  <Input 
                    id="interestedUniversities" 
                    value={Array.isArray(profile.interested_universities) ? 
                      profile.interested_universities.join(', ') : 
                      profile.interested_universities}
                    onChange={(e) => handleInputChange('interested_universities', e.target.value)}
                    placeholder="Universities you're interested in..."
                    className="mt-1 rounded-xl" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full rounded-xl text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;