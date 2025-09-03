import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendingVerifications } from './PendingVerifications';
import { VerifiedMentors } from './VerifiedMentors';
import { RejectedApplications } from './RejectedApplications';

export const MentorVerificationContent = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="pending">Not Verified</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>

        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <PendingVerifications 
            refreshKey={refreshKey} 
            onActionComplete={triggerRefresh} 
          />
        </TabsContent>
        
        <TabsContent value="verified" className="mt-6">
          <VerifiedMentors 
            refreshKey={refreshKey} 
            onActionComplete={triggerRefresh} 
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <RejectedApplications 
            refreshKey={refreshKey} 
            onActionComplete={triggerRefresh} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
