
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Car,
  CircleDot,
  Terminal
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigation } from "@/contexts/NavigationContext";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({
  className,
  collapsed = true,
  onToggle
}: SidebarProps) => {
  const { user, role, profile } = useAuth();
  const { startNewHistory } = useNavigation();
  const location = useLocation();
  const isAdmin = role === 'admin';

  // Load expanded sections from localStorage on mount
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const saved = localStorage.getItem('sidebar-expanded-sections');
    return saved ? JSON.parse(saved) : [];
  });

  // Save expanded sections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  const navigationItems = [{
    icon: Building2,
    label: "Brands",
    path: "/brands",
    adminOnly: false
  }, {
    icon: Car,
    label: "Vehicles",
    path: "/vehicles",
    adminOnly: false
  }, {
    icon: CircleDot,
    label: "Wheels",
    path: "/wheels",
    adminOnly: false
  }, {
    icon: Terminal,
    label: "DEV",
    path: "/dev",
    adminOnly: true
  }];



  return (
    <aside
      className={cn(
        "sidebar-container fixed left-4 top-4 bottom-4 bg-card border border-border rounded-2xl transition-all duration-300 flex flex-col z-50",
        collapsed ? "w-[56px]" : "w-[240px]",
        className
      )}
      data-component="sidebar"
      data-collapsed={collapsed}
      onClick={() => collapsed && onToggle?.()}
    >

      {/* Sidebar Header - Contains brand/logo or user profile */}
      <header
        className="sidebar-header flex items-center h-14 px-4 relative"
        data-element="sidebar-header"
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          to={user ? "/profile" : "/login"}
          className={cn(
            "flex items-center gap-3 hover:opacity-80 transition-opacity",
            collapsed ? "justify-center w-full" : ""
          )}
          onClick={() => startNewHistory(user ? '/profile' : '/login')}
          title={user ? "Profile" : "Login / Sign Up"}
        >
          {user ? (
            // Logged in - show profile picture
            <>
              <img
                src={profile?.avatar_url || "/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover relative z-10"
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {profile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
              )}
            </>
          ) : (
            // Not logged in - show ghost with extended click area for animation
            <div
              className="relative p-4 -m-4 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"
                alt="Login"
                className={cn(
                  "w-6 h-6 relative z-10",
                  !collapsed && "animate-ghost-float"
                )}
              />
            </div>
          )}
        </Link>
      </header>

      {/* Sidebar Navigation - Main navigation container */}
      <nav
        className="sidebar-nav flex-1 flex flex-col"
        data-element="sidebar-nav"
      >
        {/* Navigation Items List */}
        <ul
          className="nav-items-list px-4 py-1 overflow-y-auto"
          data-element="nav-items"
          role="list"
        >
          {/* Standard Navigation Items */}
          {navigationItems.map((item) => {
            if (item.adminOnly && !isAdmin) {
              return null;
            }

            return (
              <li key={item.label}>
                <Button
                  variant="ghost"
                  className={cn(
                    "group w-full justify-start gap-3 mb-1 transition-all duration-200 hover:bg-card hover:border hover:border-border rounded-lg",
                    collapsed ? "justify-center px-1" : "px-3"
                  )}
                  asChild
                  onClick={() => startNewHistory(item.path)}
                >
                  <Link to={item.path}>
                    <item.icon
                      size={20}
                      className={cn(
                        "transition-colors",
                        item.adminOnly && "text-[hsl(var(--warning))]"
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </Button>
              </li>
            );
          })}

        </ul>

        {/* Navigation Toggle Area - Invisible button for toggling sidebar */}
        <button
          className="nav-toggle-area w-full bg-transparent flex-1 cursor-pointer"
          data-element="toggle-area"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        />
      </nav>

      {/* Sidebar Footer - User controls and theme toggle */}
      <footer
        className={cn("sidebar-footer pb-safe", collapsed ? "p-4" : "px-4 py-4")}
        data-element="sidebar-footer"
      >
        {/* Theme Toggle Wrapper */}
        <div
          className={cn("theme-toggle-wrapper flex items-center", collapsed ? "justify-center" : "justify-start")}
          data-element="theme-toggle"
        >
          <ThemeToggle className="justify-center" />
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;
