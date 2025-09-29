
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  BookOpen, 
  CheckCircle, 
  Users
} from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  userType: 'student' | 'mentor';
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  userType
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">{user?.name?.charAt(0) ?? ""}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
              {user.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            {userType === 'mentor' && (
              <Badge variant={user.verified ? 'success' : 'outline'}>
                {user.verified ? 'Verified' : 'Unverified'}
              </Badge>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 py-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{user.email}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{user.country}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">Registered on {user.registrationDate}</span>
          </div>
          
          {userType === 'mentor' && (
            <>
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">{user.rating} / 5.0 ({user.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-start text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-700 font-medium mb-1">Expertise Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {user?.expertise?.map((area: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">{user.sessionsCompleted} sessions completed</span>
              </div>
            </>
          )}
          
          {userType === 'student' && (
            <>
              <div className="flex items-start text-sm">
                <BookOpen className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-700 font-medium mb-1">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {user?.interests?.map((interest: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">{user.connectedMentors} connected mentors</span>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-start gap-2">
          <Button variant="default" onClick={onClose}>
            Close
          </Button>
          {user.status === 'active' ? (
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Deactivate User
            </Button>
          ) : (
            <Button variant="outline">
              Activate User
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
