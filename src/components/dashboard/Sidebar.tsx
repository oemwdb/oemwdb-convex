import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Car,
  CircleDot,
  Gauge,
  Terminal,
  Database,
  ChevronLeft,
  PanelLeftOpen
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDevMode } from "@/contexts/DevModeContext";

const Sidebar = ({
  className,
  onHoverChange,
  hasSecondary,
  isSecondaryOpen,
  onToggleSecondary
}: {
  className?: string;
  onHoverChange?: (hovered: boolean) => void;
  hasSecondary?: boolean;
  isSecondaryOpen?: boolean;
  onToggleSecondary?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user, role, profile } = useAuth();
  const { startNewHistory } = useNavigation();
  const location = useLocation();
  const { isDevMode, toggleDevMode } = useDevMode();
  const isAdmin = role === 'admin';

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  const navigationItems = [
    { icon: Building2, label: "Brands", path: "/brands", adminOnly: false },
    { icon: Car, label: "Vehicles", path: "/vehicles", adminOnly: false },
    { icon: CircleDot, label: "Wheels", path: "/wheels", adminOnly: false },
    { icon: Gauge, label: "Engines", path: "/engines", adminOnly: false },
    { icon: Database, label: "Buckets", path: "/dev/buckets", adminOnly: true },
    { icon: Terminal, label: "Tables", path: "/dev/tables", adminOnly: true }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-sidebar transition-all duration-200 ease-out",
        isHovered ? "w-[150px]" : "w-[48px]",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo / Profile */}
      <div className="h-12 flex items-center border-b border-border px-3 shrink-0">
        <Link
          to={user ? "/profile" : "/login"}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={() => startNewHistory(user ? '/profile' : '/login')}
          title={user ? "Profile" : "Login"}
        >
          <img
            src={profile?.avatar_url || "/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"}
            alt="Profile"
            className="w-5 h-5 rounded-full object-cover flex-shrink-0"
          />
          {isHovered && (
            <span className="text-sm font-medium truncate animate-in fade-in slide-in-from-left-2 duration-150">
              {user ? (profile?.full_name || user.email?.split('@')[0] || 'User') : 'Login'}
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 flex flex-col border-r border-border overflow-hidden">
        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-0.5 px-2">
            {navigationItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              const active = isActive(item.path);

              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={() => startNewHistory(item.path)}
                    className={cn(
                      "flex items-center gap-2 h-8 px-2 rounded-md text-sm transition-colors relative group",
                      active
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      item.adminOnly && "text-warning"
                    )}
                    title={!isHovered ? item.label : undefined}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    {isHovered && (
                      <span className="truncate animate-in fade-in slide-in-from-left-2 duration-150 flex-1">
                        {item.label}
                      </span>
                    )}

                    {/* Expand Button Only - Hidden if Secondary is Open */}
                    {active && hasSecondary && isHovered && onToggleSecondary && !isSecondaryOpen && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onToggleSecondary();
                        }}
                        className="p-1 rounded-md hover:bg-background/20 text-muted-foreground hover:text-foreground transition-colors absolute right-1"
                        title="Open Menu"
                      >
                        <PanelLeftOpen className="h-4 w-4" />
                      </button>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2 shrink-0">
          {isAdmin && (
            <button
              onClick={toggleDevMode}
              className={cn(
                "flex items-center w-full h-8 px-2 rounded-md text-sm transition-colors",
                isDevMode
                  ? "bg-warning/20 text-warning"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                !isHovered && "justify-center"
              )}
              title={!isHovered ? "Dev Mode" : undefined}
            >
              <Terminal size={16} className="flex-shrink-0" />
              {isHovered && (
                <span className="ml-2 text-xs animate-in fade-in duration-150">
                  Dev Mode {isDevMode ? 'ON' : 'OFF'}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
