
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: number;
  type: 'new_mentor' | 'new_student' | 'session_completed' | 'feedback' | 'verification';
  title: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  timestamp: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

const activityItems: ActivityItem[] = [
  {
    id: 1,
    type: 'new_mentor',
    title: 'New mentor registered',
    user: {
      name: 'Michael Chen',
      initials: 'MC',
    },
    timestamp: '10 minutes ago'
  },
  {
    id: 2,
    type: 'session_completed',
    title: 'Session completed',
    user: {
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
      initials: 'SJ',
    },
    timestamp: '1 hour ago',
    status: 'completed'
  },
  {
    id: 3,
    type: 'feedback',
    title: 'New feedback received',
    user: {
      name: 'David Williams',
      initials: 'DW',
    },
    timestamp: '2 hours ago'
  },
  {
    id: 4,
    type: 'verification',
    title: 'Mentor verification requested',
    user: {
      name: 'Aisha Patel',
      avatar: '/placeholder.svg',
      initials: 'AP',
    },
    timestamp: '3 hours ago',
    status: 'pending'
  },
  {
    id: 5,
    type: 'new_student',
    title: 'New student registered',
    user: {
      name: 'James Rodriguez',
      initials: 'JR',
    },
    timestamp: '5 hours ago'
  },
  {
    id: 6,
    type: 'session_completed',
    title: 'Session cancelled',
    user: {
      name: 'Emma Wilson',
      initials: 'EW',
    },
    timestamp: '6 hours ago',
    status: 'cancelled'
  }
];

export const AdminRecentActivity: React.FC = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {activityItems.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start py-3 border-b border-gray-100 last:border-0"
            >
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-bridgeblue-100 text-bridgeblue-800 text-xs">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-gray-900 truncate">{activity.title}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{activity.user.name}</p>
                {activity.status && (
                  <div className="mt-1">
                    <Badge 
                      className={`text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
