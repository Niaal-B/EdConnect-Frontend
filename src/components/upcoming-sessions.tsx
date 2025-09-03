
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

const sessions = [
  {
    id: 1,
    date: { day: "15", month: "DEC" },
    title: "Application Strategy",
    mentor: "Sarah Johnson",
    mentorInitials: "SJ",
    time: "2:00 PM",
    color: "bg-purple-500",
  },
  {
    id: 2,
    date: { day: "18", month: "DEC" },
    title: "Personal Statement Review",
    mentor: "Michael Chen",
    mentorInitials: "MC",
    time: "10:00 AM",
    color: "bg-green-500",
  },
  {
    id: 3,
    date: { day: "22", month: "DEC" },
    title: "University Selection",
    mentor: "Emma Davis",
    mentorInitials: "ED",
    time: "4:00 PM",
    color: "bg-pink-500",
  },
];

export function UpcomingSessions() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center min-w-[50px]">
              <div className="text-lg font-bold text-blue-600">{session.date.day}</div>
              <div className="text-xs text-gray-500 uppercase">{session.date.month}</div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{session.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className={`${session.color} text-white text-xs`}>
                    {session.mentorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{session.mentor}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {session.time}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

