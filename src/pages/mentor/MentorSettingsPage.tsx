
import React, { useState } from 'react';
import MentorDashboardLayout from '@/components/MentorDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  PencilLine, 
  Save, 
  CheckCircle, 
  Info, 
  ChevronDown, 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Globe, 
  Calendar,
  Trash2,
  GraduationCap,
  BookOpen,
  PlusCircle
} from 'lucide-react';

const MentorSettingsPage: React.FC = () => {
  return (
    <MentorDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-500 mt-1">Manage your mentor profile and preferences</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button className="bg-bridgeblue-500 hover:bg-bridgeblue-600">Save Changes</Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-lightgray-200 p-1">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Personal Information</TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Education & Experience</TabsTrigger>
            <TabsTrigger value="expertise" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Areas of Expertise</TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Availability</TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face" alt="Dr. Emily Johnson" />
                      <AvatarFallback>EJ</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Upload a professional photo for your mentor profile.</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Upload New Photo</Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Emily" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Johnson" />
                  </div>
                  
                  {/* Title and University */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" defaultValue="Assistant Professor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university">Current University/Institution</Label>
                    <Input id="university" defaultValue="Stanford University" />
                  </div>
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="us">
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Palo Alto" />
                  </div>
                  
                  {/* Contact Information */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="emily.johnson@stanford.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (650) 123-4567" />
                  </div>
                  
                  {/* Bio */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea 
                      id="bio" 
                      rows={5} 
                      defaultValue="Dr. Emily Johnson is an Assistant Professor at Stanford University with over 10 years of experience in higher education. She specializes in guiding students through the application process for top-tier universities in the US and UK, with a focus on STEM fields. Dr. Johnson has helped hundreds of students secure admissions and scholarships to prestigious institutions."
                    />
                    <p className="text-sm text-gray-500">Write a compelling bio that highlights your expertise and experience as a mentor.</p>
                  </div>
                  
                  {/* Links */}
                  <div className="space-y-2 md:col-span-2">
                    <Label>Professional Links</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input placeholder="LinkedIn" defaultValue="https://linkedin.com/in/emilyjohnson" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Personal Website" defaultValue="https://emilyjohnson.edu" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Link
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education & Experience</CardTitle>
                <CardDescription>Add your academic background and professional experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Education */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-bridgeblue-500" /> Education
                    </h3>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Education
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Ph.D. in Educational Psychology</h4>
                          <p className="text-sm text-gray-600">Harvard University</p>
                          <p className="text-sm text-gray-500">2010 - 2014</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">M.A. in Higher Education</h4>
                          <p className="text-sm text-gray-600">Columbia University</p>
                          <p className="text-sm text-gray-500">2008 - 2010</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">B.A. in Psychology</h4>
                          <p className="text-sm text-gray-600">Yale University</p>
                          <p className="text-sm text-gray-500">2004 - 2008</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Experience */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-bridgeblue-500" /> Professional Experience
                    </h3>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Assistant Professor</h4>
                          <p className="text-sm text-gray-600">Stanford University</p>
                          <p className="text-sm text-gray-500">2018 - Present</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Admissions Counselor</h4>
                          <p className="text-sm text-gray-600">Princeton University</p>
                          <p className="text-sm text-gray-500">2014 - 2018</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Languages */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-bridgeblue-500" /> Languages
                    </h3>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Language
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">English</h4>
                            <p className="text-sm text-gray-500">Native</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Spanish</h4>
                            <p className="text-sm text-gray-500">Fluent</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">French</h4>
                            <p className="text-sm text-gray-500">Intermediate</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expertise">
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
                <CardDescription>Highlight your knowledge areas to connect with the right students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations</Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="py-1.5 bg-blue-50 text-blue-800 border-blue-200">
                        US University Admissions <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-blue-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-blue-50 text-blue-800 border-blue-200">
                        UK University Admissions <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-blue-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-blue-50 text-blue-800 border-blue-200">
                        Scholarship Applications <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-blue-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-blue-50 text-blue-800 border-blue-200">
                        STEM Programs <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-blue-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-blue-50 text-blue-800 border-blue-200">
                        Medical School Applications <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-blue-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Input placeholder="Add a specialization" />
                      <Button>Add</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="universities">Universities/Programs</Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="py-1.5 bg-green-50 text-green-800 border-green-200">
                        Stanford University <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-green-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-green-50 text-green-800 border-green-200">
                        Harvard University <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-green-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-green-50 text-green-800 border-green-200">
                        MIT <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-green-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-green-50 text-green-800 border-green-200">
                        Oxford University <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-green-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                      <Badge variant="outline" className="py-1.5 bg-green-50 text-green-800 border-green-200">
                        Cambridge University <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-green-100"><Trash2 className="h-3 w-3" /></Button>
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Input placeholder="Add a university/program" />
                      <Button>Add</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Session Topics</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Application Strategy</h4>
                            <p className="text-sm text-gray-500">Helping students create effective application strategies</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Essay Review</h4>
                            <p className="text-sm text-gray-500">Reviewing and providing feedback on application essays</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Interview Preparation</h4>
                            <p className="text-sm text-gray-500">Mock interviews and preparation techniques</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Scholarship Applications</h4>
                            <p className="text-sm text-gray-500">Guidance on finding and applying for scholarships</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Topic
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability Settings</CardTitle>
                <CardDescription>Set your available hours for mentoring sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Weekly Schedule</h3>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Time Slot
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Available time slots - placeholder for a more sophisticated calendar UI */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Monday</h4>
                          <p className="text-sm text-gray-500">9:00 AM - 12:00 PM (PDT)</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Wednesday</h4>
                          <p className="text-sm text-gray-500">2:00 PM - 5:00 PM (PDT)</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Friday</h4>
                          <p className="text-sm text-gray-500">10:00 AM - 1:00 PM (PDT)</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionDuration">Default Session Duration</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bufferTime">Buffer Time Between Sessions</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue placeholder="Select buffer time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No buffer</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Your Timezone</Label>
                      <Select defaultValue="pdt">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdt">Pacific Time (PDT)</SelectItem>
                          <SelectItem value="edt">Eastern Time (EDT)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="gmt">GMT (London)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxSessions">Maximum Sessions Per Day</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select maximum" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 session</SelectItem>
                          <SelectItem value="2">2 sessions</SelectItem>
                          <SelectItem value="3">3 sessions</SelectItem>
                          <SelectItem value="4">4 sessions</SelectItem>
                          <SelectItem value="5">5 sessions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoAccept">Auto-accept booking requests</Label>
                      <Switch id="autoAccept" />
                    </div>
                    <p className="text-sm text-gray-500">Automatically accept booking requests that fit your availability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your login credentials and account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="accountEmail">Email Address</Label>
                      <Input id="accountEmail" type="email" defaultValue="emily.johnson@stanford.edu" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  
                  <Button className="mt-2">Update Password</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive booking requests, session reminders, and updates via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive text message alerts for upcoming sessions</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Browser Notifications</p>
                        <p className="text-sm text-gray-500">Receive browser notifications for new messages and bookings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium text-red-600">Deactivate Account</h4>
                    <p className="text-sm text-red-500 mb-4">Temporarily hide your profile from students</p>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-100">
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorSettingsPage;
