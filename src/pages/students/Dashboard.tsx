import { RecommendedMentors } from "@/components/recommended-mentors";
import { DiscoverMentors } from "@/components/discover-mentors";
import { UpcomingSessions } from "@/components/upcoming-sessions";
import { UserStats } from "@/components/user-stats";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import StudentDashboardStats from "@/components/dashboard/StudentDashboardStats";



const Dashboard = () => {

    return(
            <StudentDashboardStats/>
)
}

export default Dashboard;