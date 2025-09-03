import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MentorVerificationContent } from '@/components/admin/MentorVerificationContent';
import { useState } from 'react';
const MentorVerification = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('students');
    const [filters, setFilters] = useState({
      status: 'all',
      verified: 'all',
      date: 'all',
      country: 'all',
    });

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Verification</h1>
            <p className="text-gray-600">Review and verify mentor applications and documents</p>
          </div>  
          <MentorVerificationContent />
        </main>
      </div>
    </div>
  );
};

export default MentorVerification;
