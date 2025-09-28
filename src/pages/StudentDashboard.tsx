import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { RecommendedMentors } from "@/components/recommended-mentors";
import { DiscoverMentors } from "@/components/discover-mentors";
import { UpcomingSessions } from "@/components/upcoming-sessions";
import { UserStats } from "@/components/user-stats";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import StudentDashboardStats from "@/components/dashboard/StudentDashboardStats";
import { Toaster } from "sonner";



const StudentDashboard = () => {

    return(

    
   <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <DashboardHeader />
          <Toaster position="top-right" />
            <StudentDashboardStats/>
        </main>
      </div>
    </SidebarProvider>   
)
}

export default StudentDashboard;