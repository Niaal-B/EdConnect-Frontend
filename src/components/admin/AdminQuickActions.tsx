
import React from 'react';
import { UserCheck, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AdminQuickActions: React.FC = () => {
  const quickActions = [
    {
      title: 'Mentor Verification',
      description: 'Review and verify mentor profiles',
      icon: UserCheck,
      action: 'View Pending Verifications',
      color: 'bg-amber-100',
      iconColor: 'text-amber-600',
      count: 24
    },
    {
      title: 'Session Requests',
      description: 'Handle pending session requests',
      icon: Calendar,
      action: 'View All Requests',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      count: 18
    },
    {
      title: 'Feedback & Ratings',
      description: 'Review latest feedback and ratings',
      icon: Star,
      action: 'View All Feedback',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      count: 42
    }
  ];

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center">
                <div className={`${action.color} p-2 rounded-lg mr-3`}>
                  <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {action.title}
                    {action.count && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                        {action.count}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700" 
                variant="outline"
              >
                {action.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
