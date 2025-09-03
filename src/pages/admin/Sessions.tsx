import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SessionManagementContent } from '@/components/admin/SessionManagementContent';

export default function Sessions() {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

 return (
     <div className="min-h-screen bg-gray-50 flex">
       <AdminSidebar sidebarOpen={sidebarOpen} 
         setSidebarOpen={setSidebarOpen} 
         isActive={isActive} />
       <div className="flex-1 flex flex-col">
         <AdminHeader  setSidebarOpen={setSidebarOpen} />
         <main className="flex-1 p-6">

           <SessionManagementContent />
         </main>
       </div>
     </div>
   );
}