import { 
  Globe, MessageSquare, Calendar, Search, 
  GraduationCap, FileText, Settings, Bell 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

// Add path for each item
const menuItems = [
  { title: "Dashboard", icon: Globe, path: "/student/dashboard" },
  { title: "Messages", icon: MessageSquare, path: "/student/messages" },
  { title: "Schedule", icon: Calendar, path: "/student/schedule" },
  { title: "Discover", icon: Search, path: "/student/discover" },
  { title: "My-Mentors", icon: GraduationCap, path: "/student/my-mentors" },
  { title: "Settings", icon: Settings, path: "/student/settings" },
];

export function AppSidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      {/* Header */}
      <SidebarHeader className="">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl shadow-md bg-transparent">
             <p>EdConnect</p>
              </div>
            </div>
          </SidebarHeader>


      {/* Menu Content */}
      <SidebarContent className="px-4 py-6">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.title} className="mb-1">
                <Link to={item.path} className="block">
                  <SidebarMenuButton
                    className={`w-full justify-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="font-medium text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-gray-100">
        <Link
          to="/student/profile"
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
              {user.username?.slice(0, 2).toUpperCase() || "NA"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{user.username}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
         
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
