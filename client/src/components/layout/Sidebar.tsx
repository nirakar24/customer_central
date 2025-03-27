import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Package,
  BarChartHorizontal,
  LifeBuoy,
  LogOut,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [location] = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      path: "/",
    },
    {
      title: "Customers",
      icon: <Users className="mr-3 h-5 w-5" />,
      path: "/customers",
    },
    {
      title: "Products",
      icon: <Package className="mr-3 h-5 w-5" />,
      path: "/products",
    },
    {
      title: "Sales Pipeline",
      icon: <BarChartHorizontal className="mr-3 h-5 w-5" />,
      path: "/sales",
    },
    {
      title: "Support Tickets",
      icon: <LifeBuoy className="mr-3 h-5 w-5" />,
      path: "/support",
    },
  ];

  return (
    <div 
      className={`bg-white dark:bg-gray-900 ${
        isOpen ? "w-64" : "w-0 md:w-20"
      } flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center overflow-hidden">
          <svg className="w-8 h-8 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          {isOpen && (
            <h1 className="ml-2 text-xl font-bold font-inter text-primary dark:text-white whitespace-nowrap">
              InsightSync
            </h1>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="md:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
        </Button>
      </div>
      
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === item.path
                  ? "bg-blue-50 text-blue-500 dark:bg-gray-800 dark:bg-opacity-40 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {isOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center">
          <img 
            className="h-8 w-8 rounded-full" 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User avatar" 
          />
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">Raj Mehta</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">Sales Manager</p>
            </div>
          )}
        </div>
        
        {isOpen ? (
          <div className="mt-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-xs">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <ThemeToggle />
          </div>
        ) : (
          <div className="mt-3 flex flex-col items-center space-y-2">
            <Button variant="ghost" size="icon" className="text-xs">
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
