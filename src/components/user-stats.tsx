
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Award, Clock } from "lucide-react";

const stats = [
  {
    title: "Completed Sessions",
    value: "12",
    subtitle: "This month",
    icon: Clock,
    color: "bg-blue-500",
    trend: "+2 from last month"
  },
  {
    title: "Mentors Connected",
    value: "5",
    subtitle: "Active connections",
    icon: Users,
    color: "bg-green-500",
    trend: "+1 this week"
  },
  {
    title: "Progress Score",
    value: "85%",
    subtitle: "Journey completion",
    icon: Award,
    color: "bg-purple-500",
    trend: "+5% this month"
  }
];

export function UserStats() {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 ${stat.color} rounded-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-900 text-sm">{stat.title}</div>
                <div className="text-xs text-gray-500">{stat.subtitle}</div>
                <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}