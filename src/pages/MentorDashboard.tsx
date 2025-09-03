
import { useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MentorDashboardLayout from "@/components/MentorDashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProfileCompletion } from "@/components/dashboard/ProfileCompletion";
import { WeeklySessions } from "@/components/dashboard/WeeklySessions";
import { StudentRequestsList } from "@/components/dashboard/StudentRequestsList";
import { SessionsTable } from "@/components/dashboard/SessionsTable";
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { log } from "node:console";
import { FL } from "@/components/dashboard/FeedbackList";

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const {user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  
  
  return (
    <MentorDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.username}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-bridgeblue-500 hover:bg-bridgeblue-600">
              <Clock className="mr-2 h-4 w-4" /> Set Availability
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-lightgray-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Student Requests</TabsTrigger>
            <TabsTrigger value="session" className="data-[state=active]:bg-white data-[state=active]:text-bridgeblue-600 data-[state=active]:shadow-sm">Upcoming Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <StatsCards onTabChange={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-6">
            <StudentRequestsList />
          </TabsContent>
          
          
          <TabsContent value="session" className="space-y-6">
            <FL />
          </TabsContent>
        </Tabs>
      </div>
    </MentorDashboardLayout>
  );
};

export default MentorDashboard;
