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
import { useDevMode } from "@/contexts/DevModeContext";
import { useUser } from "@clerk/react";
import { UserButton } from "@clerk/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { user: clerkUser, isSignedIn } = useUser();
  const { startNewHistory } = useNavigation();
  const location = useLocation();
  const { isDevMode, toggleDevMode } = useDevMode();
  const isAdmin = false; // TODO: implement RBAC via Clerk metadata

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
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col z-50 h-full transition-all duration-300 ease-in-out",
          isHovered ? "w-[200px]" : "w-[60px]",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo / Profile */}
        <div className="h-12 flex items-center px-2 mb-2 shrink-0">
          {isSignedIn ? (
            // Signed in: show Clerk UserButton + name when expanded
            <div className={cn(
              "flex items-center gap-3 w-full p-2 rounded-full hover:bg-white/10 transition-colors",
              !isHovered && "justify-center"
            )}>
              <UserButton afterSignOutUrl="/" />
              {isHovered && (
                <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
                  <span className="text-sm font-semibold truncate leading-none">
                    {clerkUser?.fullName || clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate leading-none mt-1">
                    {isAdmin ? 'Administrator' : 'Member'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            // Not signed in: show guest link to login
            <Link
              to="/login"
              state={{ resetNavigation: true }}
              className={cn(
                "flex items-center gap-3 w-full p-2 rounded-full hover:bg-white/10 transition-colors",
                !isHovered && "justify-center"
              )}
              onClick={() => startNewHistory('/login')}
            >
              <div className="relative shrink-0">
                <img
                  src="/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"
                  alt="Guest"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-border/50"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-sidebar" />
              </div>
              {isHovered && (
                <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
                  <span className="text-sm font-semibold truncate leading-none">Sign In</span>
                  <span className="text-[10px] text-muted-foreground truncate leading-none mt-1">Guest Access</span>
                </div>
              )}
            </Link>
          )}
        </div>

        <div className="flex-1 flex flex-col px-2 gap-1 overflow-hidden">
          {navigationItems.map((item) => {
            if (item.adminOnly && !isAdmin && !isDevMode) return null;
            const active = isActive(item.path);

            const LinkContent = (
              <Link
                to={item.path}
                state={{ resetNavigation: true }}
                onClick={() => startNewHistory(item.path)}
                className={cn(
                  "flex items-center gap-3 h-10 px-4 rounded-full text-sm transition-all duration-200 relative group",
                  active
                    ? "bg-white text-black shadow-sm font-medium"
                    : "text-muted-foreground hover:bg-white/10 hover:text-foreground",
                  item.adminOnly && !active && "text-amber-500/80 hover:text-amber-500",
                  !isHovered && "justify-center",
                  className
                )}
              >
                <item.icon size={20} className={cn("shrink-0 transition-transform duration-200", active && "scale-105")} />

                {isHovered && (
                  <span className="truncate animate-in fade-in slide-in-from-left-1 duration-200">
                    {item.label}
                  </span>
                )}

                {/* Active Indicator Dot for Compact Mode */}
                {!isHovered && active && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-black/80 dark:bg-white/80" />
                )}
              </Link>
            );

            if (!isHovered) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    {LinkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="font-medium bg-zinc-900 border-zinc-800 text-zinc-100">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.label}>{LinkContent}</div>;
          })}
        </div>

        {/* Footer */}
        <div className="p-2 shrink-0">
          {isHovered ? (
            <button
              onClick={toggleDevMode}
              className={cn(
                "flex items-center w-full h-9 px-3 rounded-full text-xs font-medium transition-colors border",
                isDevMode
                  ? "bg-amber-950/30 border-amber-900/50 text-amber-500"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Terminal size={14} className="mr-2" />
              Development Mode
              <div className={cn("ml-auto w-1.5 h-1.5 rounded-full", isDevMode ? "bg-amber-500" : "bg-zinc-700")} />
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleDevMode}
                  className={cn(
                    "flex items-center justify-center w-full h-10 rounded-full transition-colors",
                    isDevMode ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Terminal size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Dev Mode: {isDevMode ? 'ON' : 'OFF'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
