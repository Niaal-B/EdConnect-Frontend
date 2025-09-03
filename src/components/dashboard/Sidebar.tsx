import { useSelector } from 'react-redux';
import { RootState } from '../../stores/store';
import { navItems } from "./navConfig";
import { NavItem } from "./NavItem";
import { X } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isActive: (path: string) => boolean;
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen, isActive }: SidebarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavItemClick = (itemId: string) => {
    if (itemId === 'set-availability') {
      console.log('Set Availability clicked from sidebar');
    }
  };

  const filteredNavItems = navItems.filter((item) => {
    if (item.id === "set-availability") {
      return user?.role === "mentor" && user?.is_verified; 
    }
    return true;
  });

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-bridgeblue-600">BridgeUp</span>
            <span className="ml-2 px-2 py-1 bg-bridgeblue-100 text-bridgeblue-800 text-xs font-medium rounded-md">
              Mentor
            </span>
          </div>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="py-4 px-3">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (   
              <NavItem 
                key={item.id}
                id={item.id}
                name={item.name}
                path={item.path || "#"}
                icon={item.icon}
                badge={item.badge}
                isActive={isActive}
                onClick={item.action ? () => handleNavItemClick(item.id) : undefined}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
