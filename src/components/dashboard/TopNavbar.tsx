
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";

interface TopNavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export const TopNavbar = ({ setSidebarOpen }: TopNavbarProps) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex h-16 items-center justify-between px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center ml-auto">
          <NotificationsMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
