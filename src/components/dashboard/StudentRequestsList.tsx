import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface StudentRequest {
  id: number;
  status: string;
  created_at: string;
  student: {
    id: number;
    username: string;
    student_profile: {
      profile_picture: string | null;
      preferred_countries: string[];
      fields_of_interest: string[];
    };
  };
}

export const StudentRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/connections/pending/");
      setRequests(res.data.results);
    } catch {
      toast({ title: "Error", description: "Failed to load requests.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id: number, decision: "accepted" | "rejected") => {
    setLoading(true);
    try {
      await api.patch(`/connections/${id}/`, { status: decision });
      toast({ title: `Request ${decision}`, description: `Connection request ${decision}.` });
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (requests.length === 0) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">No Pending Requests</CardTitle>
          <CardDescription>You're all caught up!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Student Mentorship Requests</CardTitle>
        <CardDescription className="text-gray-600">Review and respond to connection requests sent by students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <Avatar className="h-12 w-12 shadow-sm ring-1 ring-white">
                    {req.student.student_profile.profile_picture ? (
                      <AvatarImage src={req.student.student_profile.profile_picture} alt={req.student.username} />
                    ) : (
                      <AvatarFallback className="bg-bridgeblue-600 text-white font-semibold">
                        {req.student.username.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{req.student.username}</p>
                    <p className="text-sm text-gray-500">
                      {req.student.student_profile.preferred_countries?.[0] || "Unknown country"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested on {new Date(req.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end sm:text-right">
                  {req.student.student_profile.fields_of_interest?.length > 0 && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Interests: </span>
                      {req.student.student_profile.fields_of_interest.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={loading}
                  onClick={() => handleDecision(req.id, "accepted")}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => handleDecision(req.id, "rejected")}
                >
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
