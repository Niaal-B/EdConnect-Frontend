import { User, Settings, LogOut } from "lucide-react";
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
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { log } from "node:console";

export const UserMenu = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post("user/logout/")

      if (res) {
        navigate("/mentor/register");
      } else {
        console.error("Logout failed with status", res.status);
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-2 flex items-center gap-2 pl-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profile_image} />
            <AvatarFallback>
              {user.username?.slice(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/mentor/profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
