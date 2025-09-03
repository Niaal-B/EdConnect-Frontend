
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Session {
  id: number;
  studentName: string;
  avatar: string;
  date: string;
  time: string;
  topic: string;
  status: string;
}

export const SessionsTable = () => {
  // In a real app, this would come from props or API
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
    },
    {
      id: 3,
      studentName: "Elena Petrova",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?&w=128&h=128&fit=crop&crop=face",
      date: "May 6, 2025",
      time: "18:00 - 19:00",
      topic: "Campus Life in the UK",
      status: "Confirmed"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upcoming Mentoring Sessions</CardTitle>
        <CardDescription>Scheduled sessions with your mentees</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={session.avatar} alt={session.studentName} />
                      <AvatarFallback>{session.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{session.studentName}</span>
                  </div>
                </TableCell>
                <TableCell>{session.topic}</TableCell>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.time}</TableCell>
                <TableCell>
                  <Badge variant={session.status === "Confirmed" ? "default" : "outline"} className={session.status === "Confirmed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Join Call</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
