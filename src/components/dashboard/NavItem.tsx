
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  isActive: (path: string) => boolean;
  onClick?: () => void;
}

export const NavItem = ({ id, name, path, icon: Icon, badge, isActive, onClick }: NavItemProps) => {
  if (onClick) {
    return (
      <button 
        key={id}
        onClick={onClick}
        type="button"
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
          isActive(path) 
            ? "text-bridgeblue-600 bg-bridgeblue-50" 
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Icon className="mr-3 h-5 w-5" />
        {name}
        {badge && (
          <Badge className="ml-auto bg-bridgeblue-100 text-bridgeblue-600 hover:bg-bridgeblue-100">
            {badge}
          </Badge>
        )}
      </button>
    );
  }
  
  return (
    <Link 
      key={id}
      to={path}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
        isActive(path) 
          ? "text-bridgeblue-600 bg-bridgeblue-50" 
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="mr-3 h-5 w-5" />
      {name}
      {badge && (
        <Badge className="ml-auto bg-bridgeblue-100 text-bridgeblue-600 hover:bg-bridgeblue-100">
          {badge}
        </Badge>
      )}
    </Link>
  );
};
