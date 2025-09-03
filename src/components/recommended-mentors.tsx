import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    subject: "Computer Science",
    university: "MIT, Boston",
    initials: "SJ",
    color: "bg-purple-500",
  },
  {
    id: 2,
    name: "Michael Chen",
    subject: "Business Analytics",
    university: "Stanford, California",
    initials: "MC",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Emma Davis",
    subject: "International Relations",
    university: "Oxford, UK",
    initials: "ED",
    color: "bg-pink-500",
  },
];

export function RecommendedMentors() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Recommended Mentors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className={`${mentor.color} text-white font-semibold text-lg`}>
                    {mentor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{mentor.subject}</p>
                  <p className="text-sm text-gray-500">{mentor.university}</p>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}