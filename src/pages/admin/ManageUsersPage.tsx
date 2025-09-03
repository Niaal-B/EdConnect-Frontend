import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { UsersFilter } from '@/components/admin/users/UsersFilter';
import { UserDetailsModal } from '@/components/admin/users/UserDetailsModal';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
// Mock data fallback
import { studentUsers, mentorUsers } from '@/components/admin/users/mockUsers';

const ManageUsersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [mentorSearchQuery, setMentorSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [studentFilters, setStudentFilters] = useState({
    status: 'all',
    date: 'all',
    country: 'all',
  });
  const [mentorFilters, setMentorFilters] = useState({
    status: 'all',
    verified: 'all',
    date: 'all',
    country: 'all',
  });

  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [allMentors, setAllMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users/');
        
        // More robust data handling
        const users = response?.data?.users || response?.data || [];
        
        const students = users.filter((user: any) => 
          user?.role?.toLowerCase() === 'student'
        );
        const mentors = users.filter((user: any) => 
          user?.role?.toLowerCase() === 'mentor'
        );
        
        setAllStudents(students);
        setAllMentors(mentors);
        
        console.log('Students loaded:', students);
        console.log('Mentors loaded:', mentors);
        
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users');
        
        // Fallback to mock data if API fails
        setAllStudents(studentUsers || []);
        setAllMentors(mentorUsers || []);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  // Function to check if current path is active
  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (activeTab === 'students') {
      setStudentFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    } else {
      setMentorFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Enhanced filter function with better error handling
  const filterUsers = (users: any[], userType: 'student' | 'mentor', searchQuery: string, filters: any) => {
    if (!Array.isArray(users)) {
      console.warn('Users is not an array:', users);
      return [];
    }

    return users.filter(user => {
      // Ensure user object exists
      if (!user) return false;

      // Search filter - more robust search
      if (searchQuery && searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase().trim();
        
        // Safe property access with fallbacks
        const username = user.username || user.name || '';
        const email = user.email || '';
        const id = user.id || '';
        const firstName = user.firstName || user.first_name || '';
        const lastName = user.lastName || user.last_name || '';
        
        const nameMatch = username.toLowerCase().includes(searchLower) ||
                         firstName.toLowerCase().includes(searchLower) ||
                         lastName.toLowerCase().includes(searchLower) ||
                         `${firstName} ${lastName}`.toLowerCase().includes(searchLower);
        
        const emailMatch = email.toLowerCase().includes(searchLower);
        const idMatch = id.toString().toLowerCase().includes(searchLower);
        
        if (!nameMatch && !emailMatch && !idMatch) {
          return false;
        }
      }
      
      // Status filter
      if (filters.status !== 'all') {
        let userStatus = 'inactive';
        
        // Handle different status formats
        if (user.status) {
          userStatus = user.status.toLowerCase();
        } else if (user.is_active !== undefined) {
          userStatus = user.is_active ? 'active' : 'inactive';
        } else if (user.active !== undefined) {
          userStatus = user.active ? 'active' : 'inactive';
        }
        
        if (userStatus !== filters.status) {
          return false;
        }
      }
      
      // Verified filter (for mentors only) - handle different data formats
      if (userType === 'mentor' && filters.verified !== 'all') {
        const isVerified = user.verified || user.is_verified || false;
        const verifiedString = isVerified.toString();
        if (verifiedString !== filters.verified) {
          return false;
        }
      }
      
      // Country filter
      if (filters.country !== 'all') {
        const userCountry = user.country || user.location || '';
        if (userCountry !== filters.country) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Memoize filtered results to prevent unnecessary recalculations
  const filteredStudents = React.useMemo(() => {
    return filterUsers(allStudents, 'student', studentSearchQuery, studentFilters);
  }, [allStudents, studentSearchQuery, studentFilters]);

  const filteredMentors = React.useMemo(() => {
    return filterUsers(allMentors, 'mentor', mentorSearchQuery, mentorFilters);
  }, [allMentors, mentorSearchQuery, mentorFilters]);

  // Handle search input with debouncing
  const handleStudentSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentSearchQuery(value);
  };

  const handleMentorSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMentorSearchQuery(value);
  };

  // Get current search query and search handler based on active tab
  const currentSearchQuery = activeTab === 'students' ? studentSearchQuery : mentorSearchQuery;
  const currentSearchHandler = activeTab === 'students' ? handleStudentSearchChange : handleMentorSearchChange;
  const currentFilters = activeTab === 'students' ? studentFilters : mentorFilters;

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <AdminSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          isActive={isActive} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isActive={isActive} 
      />
      
      <div className="flex-1">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <div className="text-sm text-gray-500 mt-1">
              Manage student and mentor accounts
              {error && (
                <div className="text-red-500 mt-1">
                  {error} (Using fallback data)
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            <Tabs 
              defaultValue="students" 
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 pt-6">
                <TabsList className="mb-4 sm:mb-0">
                  <TabsTrigger value="students" className="px-5">
                    Students ({filteredStudents.length})
                  </TabsTrigger>
                  <TabsTrigger value="mentors" className="px-5">
                    Mentors ({filteredMentors.length})
                  </TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by name, email, ID..." 
                    className="pl-9" 
                    value={currentSearchQuery}
                    onChange={currentSearchHandler}
                  />
                  {currentSearchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1.5 h-6 w-6 p-0"
                      onClick={() => {
                        if (activeTab === 'students') {
                          setStudentSearchQuery('');
                        } else {
                          setMentorSearchQuery('');
                        }
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
              
              <UsersFilter 
                activeTab={activeTab} 
                filters={currentFilters} 
                onFilterChange={handleFilterChange} 
              />
              
              <TabsContent value="students" className="m-0 pt-0">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {studentSearchQuery || Object.values(studentFilters).some(f => f !== 'all') 
                      ? 'No students match your search criteria' 
                      : 'No students found'
                    }
                  </div>
                ) : (
                  <UsersTable 
                    users={filteredStudents} 
                    userType="student"
                    onViewProfile={handleViewProfile} 
                  />
                )}
              </TabsContent>
              
              <TabsContent value="mentors" className="m-0 pt-0">
                {filteredMentors.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {mentorSearchQuery || Object.values(mentorFilters).some(f => f !== 'all')
                      ? 'No mentors match your search criteria' 
                      : 'No mentors found'
                    }
                  </div>
                ) : (
                  <UsersTable 
                    users={filteredMentors} 
                    userType="mentor"
                    onViewProfile={handleViewProfile} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <UserDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        userType={activeTab === 'students' ? 'student' : 'mentor'}
      />
    </div>
  );
};

export default ManageUsersPage;