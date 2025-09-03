
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Star, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { AdminQuickActions } from '@/components/admin/AdminQuickActions';
import { useAuthVerification } from '../../hooks/useAuthVerification';
import { RootState } from '@/stores/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import AdminStats from '@/components/admin/AdminStats';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { isAuthenticated,user } = useSelector((state: RootState) => state.auth);
  const checkingSession = useAuthVerification();
  const navigate = useNavigate()
  console.log(user);
  
  
  
    useEffect(() => {
      console.log(checkingSession)
      if(user.role!="admin"){
        console.log(user)
        navigate("/admin/login")
      }
   
    }, []);

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isActive={isActive} />
      
      <div className="flex-1">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              <span>Dashboard Overview</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <AdminStats/>
          
          {/* Charts */}
          {/* <AdminCharts /> */}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              {/* <AdminRecentActivity /> */}
            </div>
            
            {/* Quick Actions */}
            <div>
              {/* <AdminQuickActions /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
