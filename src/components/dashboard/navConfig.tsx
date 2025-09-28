
import { 
  LayoutDashboard, 
  CalendarDays, 
  MessageSquare, 
  BookOpen, 
  DollarSign, 
  Star, 
  Settings,
  CalendarPlus
} from "lucide-react";

// Navigation item type that supports both paths and callbacks
interface NavItem {
  id: string;
  name: string;
  path?: string;
  icon: React.ElementType;
  badge?: number;
  action?: string; // Action identifier for items that should trigger a callback
}

// Navigation items for the sidebar
export const navItems: NavItem[] = [
  { 
    id: 'dashboard',
    name: 'Dashboard', 
    path: '/mentor/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    id: 'sessions',
    name: 'My Sessions', 
    path: '/mentor/sessions', 
    icon: CalendarDays,
  },
  { 
    id: 'messages',
    name: 'Messages', 
    path: '/mentor/messages', 
    icon: MessageSquare,
  },
  { 
    id: 'earnings',
    name: 'My Earnings', 
    path: '/mentor/earnings', 
    icon: DollarSign 
  },
  { 
    id: 'feedback',
    name: 'Feedback & Ratings', 
    path: '/mentor/feedback', 
    icon: Star 
  },
  { 
    id: 'settings',
    name: 'Profile Settings', 
    path: '/mentor/profile', 
    icon: Settings 
  },
  {
    id: 'set-availability',
    name: 'Set Availability',
    path: '/mentor/mentor-slots',
    icon: CalendarPlus
  }
];
