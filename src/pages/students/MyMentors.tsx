
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Users, MessageSquare, Eye, Mail } from "lucide-react";
import { myMentorsApi, type Mentor } from "@/services/myMentorsApi";
import { MentorDetailsModal } from "@/components/MentorDetailsModal";

const MyMentors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['myMentors', currentPage],
    queryFn: () => myMentorsApi.fetchMyMentors(currentPage),
  });

  const handleViewProfile = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
  };

  const MentorCardSkeleton = () => (
    <Card className="h-48">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <DashboardHeader />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">My Mentors</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MentorCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <DashboardHeader />
            <div className="p-6">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <p className="text-red-700">Error loading your mentors. Please try again later.</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const totalPages = Math.ceil((data?.count || 0) / 10);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Mentors</h1>
              <Badge variant="secondary" className="ml-2">
                {data?.count || 0} connected
              </Badge>
            </div>

            {data?.results && data.results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {data.results.map((connection) => {
                    const mentor = connection.mentor_info;
                    const displayName = mentor.full_name || mentor.email.split('@')[0];
                    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

                    return (
                      <Card key={connection.id} className="hover:shadow-lg transition-shadow duration-300 h-48">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center gap-4 mb-4 flex-1">
                            <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                              <AvatarImage src={mentor.profile_picture || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{mentor.email}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => console.log('Message mentor:', mentor.email)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleViewProfile(mentor)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        {data.previous && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(currentPage - 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={page === currentPage}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {data.next && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(currentPage + 1)}
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No mentors connected yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start connecting with mentors to see them here and access their available time slots.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Browse Mentors
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Mentor Details Modal */}
      {selectedMentor && (
        <MentorDetailsModal
          mentor={selectedMentor}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </SidebarProvider>
  );
};

export default MyMentors;