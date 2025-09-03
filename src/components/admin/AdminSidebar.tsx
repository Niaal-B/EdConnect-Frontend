
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Star, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminNavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const adminNavItems: AdminNavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Users', path: '/admin/users', icon: Users },
  { name: 'Mentor Verification', path: '/admin/verification', icon: UserCheck },
  { name: 'Sessions Management', path: '/admin/sessions', icon: Calendar },
  { name: 'Payments', path: '/admin/payments', icon: DollarSign },
  { name: 'Feedback & Ratings', path: '/admin/feedback', icon: Star },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  isActive 
}) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-bridgeblue-600 to-indigo-600 bg-clip-text text-transparent">BridgeUp</span>
            <span className="ml-2 px-2 py-1 bg-bridgeblue-100 text-bridgeblue-800 text-xs font-medium rounded-md">
              Admin
            </span>
          </div>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 px-3">
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive(item.path) 
                    ? "text-white bg-gradient-to-r from-bridgeblue-600 to-indigo-600" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  isActive(item.path) ? "text-white" : "text-gray-500"
                )} />
                {item.name}
              </Link>
            ))}

            {/* Logout button */}
            <button 
              className="flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 mt-4"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Logout
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};
