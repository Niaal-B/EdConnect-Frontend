
import { Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Session {
  id: number;
  studentName: string;
  avatar: string;
  date: string;
  time: string;
  topic: string;
  status: string;
}

interface WeeklySessionsProps {
  onViewAllSessions: () => void;
}

export const WeeklySessions = ({ onViewAllSessions }: WeeklySessionsProps) => {
  // In a real app, this would come from props or context
  const upcomingSessions: Session[] = [
    {
      id: 1,
      studentName: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?&w=128&h=128&fit=crop&crop=face",
      date: "May 2, 2025",
      time: "10:00 - 11:00",
      topic: "US University Applications",
      status: "Confirmed"
    },
    {
      id: 2,
      studentName: "Jamal Wilson",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?&w=128&h=128&fit=crop&crop=face",
      date: "May 4, 2025",
      time: "14:00 - 15:00",
      topic: "Scholarship Strategy",
      status: "Pending"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="mr-2 text-bridgeblue-500 h-5 w-5" />
          This Week's Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingSessions.map((session) => (
          <div key={session.id} className="flex items-center py-3 first:pt-0 last:pb-0">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={session.avatar} alt={session.studentName} />
              <AvatarFallback>{session.studentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <p className="font-medium">{session.studentName}</p>
                <Badge variant={session.status === "Confirmed" ? "default" : "outline"} className={session.status === "Confirmed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                  {session.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{session.topic}</p>
              <p className="text-xs text-muted-foreground">{session.date} • {session.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onViewAllSessions}>View All Sessions</Button>
      </CardFooter>
    </Card>
  );
};
