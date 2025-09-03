
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationsMenu } from "@/components/dashboard/NotificationsMenu";

export function DashboardHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Hey...👋</h1>
          <p className="text-gray-600">Let's continue your study abroad journey</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search mentors, sessions, resources..."
              className="pl-10 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors rounded-xl"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-gray-100">
          <NotificationsMenu/>
          </Button>
        </div>
      </div>
    </div>
  );
}
