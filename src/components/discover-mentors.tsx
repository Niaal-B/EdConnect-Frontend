
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, MapPin, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const featuredMentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    expertise: "Computer Science",
    university: "MIT",
    country: "USA",
    rating: 4.9,
    sessions: 150,
    available: true,
    price: "$50/hr"
  },
  {
    id: 2,
    name: "Prof. James Wilson",
    expertise: "Business Administration",
    university: "Oxford",
    country: "UK",
    rating: 4.8,
    sessions: 200,
    available: false,
    price: "$60/hr"
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    expertise: "Medicine",
    university: "Barcelona",
    country: "Spain",
    rating: 4.9,
    sessions: 120,
    available: true,
    price: "$45/hr"
  }
];

export function DiscoverMentors() {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Discover Mentors
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by expertise, university, or name..."
              className="pl-10 border-gray-200 focus:border-blue-500 rounded-lg"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6">
            Search
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {featuredMentors.map((mentor) => (
            <div key={mentor.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{mentor.name}</h4>
                    <p className="text-sm text-blue-600 font-medium mb-1">{mentor.expertise}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {mentor.university}, {mentor.country}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {mentor.rating} ({mentor.sessions} sessions)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 mb-2">{mentor.price}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${mentor.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-500">
                      {mentor.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className={`rounded-lg ${mentor.available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!mentor.available}
                  >
                    {mentor.available ? 'Connect' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" className="rounded-lg px-6">
            View All Mentors
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
