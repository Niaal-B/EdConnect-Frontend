import { useEffect, useState } from "react";
import { Users, Calendar, MessageSquare } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface StatsCardProps {
  onTabChange: (tabValue: string) => void;
}

interface StatsData {
  studentRequests: { length: number };
  upcomingSessions: { length: number };
  feedbackMessages: { length: number };
}

export const StatsCards = ({ onTabChange }: StatsCardProps) => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("mentors/dashboard/stats");
        setData(response.data); 
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (!data) {
    return <div>Failed to load stats</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Student Requests */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <Users className="mr-2 text-bridgeblue-500 h-5 w-5" />
            Student Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-3xl font-bold">{data.pending_requests_count}</div>
          <p className="text-sm text-muted-foreground">New requests pending your response</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="text-bridgeblue-500 hover:text-bridgeblue-600 p-0"
            onClick={() => onTabChange("requests")}
          >
            View all requests
          </Button>
        </CardFooter>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <Calendar className="mr-2 text-bridgeblue-500 h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-3xl font-bold">{data.confirmed_sessions_count}</div>
          <p className="text-sm text-muted-foreground">Scheduled mentoring sessions</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="text-bridgeblue-500 hover:text-bridgeblue-600 p-0"
            onClick={() => onTabChange("session")}
          >
            View all sessions
          </Button>
        </CardFooter>
      </Card>

      {/* Feedback */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <MessageSquare className="mr-2 text-bridgeblue-500 h-5 w-5" />
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-3xl font-bold">0</div>
          <p className="text-sm text-muted-foreground">Recent feedback from mentees</p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="text-bridgeblue-500 hover:text-bridgeblue-600 p-0"
            onClick={() => onTabChange("feedback")}
          >
            View all feedback
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
