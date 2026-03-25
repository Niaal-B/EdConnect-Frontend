import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/pages/dashboard-header";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
                <AppSidebar />
                <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                    <DashboardHeader />
                    <div className="flex-1 overflow-y-auto">
                        <Toaster position="top-right" />
                        <div className="p-6">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default StudentLayout;
