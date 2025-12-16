
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Car,
  CircleDot,
  Terminal,
  ChevronRight,
  Users,
  ShoppingCart,
  Database,
  Layers,
  ClipboardList,
  ScanLine,
  Zap,
  FileText,
  Package,
  Link as LinkIcon
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
  const { user, role } = useAuth();
  const { startNewHistory } = useNavigation();
  const location = useLocation();
  const isAdmin = role === 'admin';

  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

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
  }];

  // DEV section with nested subsections
  const devSection = {
    id: 'dev',
    label: 'DEV',
    icon: Terminal,
    adminOnly: true,
    subsections: [
      {
        id: 'admin-tools',
        label: 'Admin Tools',
        items: [
          { icon: Users, label: 'Users', path: '/users' },
          { icon: ShoppingCart, label: 'Market', path: '/market' },
          { icon: Database, label: 'Database', path: '/dev/database' },
          { icon: ClipboardList, label: 'Registered Vehicles', path: '/dev/registered-vehicles' }
        ]
      },
      {
        id: 'user-tools',
        label: 'User Tools',
        items: [
          { icon: ScanLine, label: 'VIN Decoder', path: '/dev/vin-decoder' },
          { icon: Zap, label: 'Cool Board', path: '/cool-board' },
          { icon: FileText, label: 'Contribute', path: '/contribute' },
          { icon: Package, label: 'Templates', path: '/dev/templates' },
          { icon: LinkIcon, label: 'Site Map', path: '/dev/site-map' }
        ]
      }
    ]
  };

  return (
    <aside
      className={cn(
        "sidebar-container fixed left-4 top-4 bottom-4 bg-card border border-border rounded-2xl transition-all duration-300 flex flex-col z-50",
        collapsed ? "w-[56px]" : "w-[240px]",
        className
      )}
      data-component="sidebar"
      data-collapsed={collapsed}
      onClick={onToggle}
    >

      {/* Sidebar Header - Contains brand/logo */}
      <header
        className="sidebar-header flex items-center h-14 px-4 relative"
        data-element="sidebar-header"
      >
        {!collapsed ? (
          <Link to="/" className="flex items-center" onClick={() => startNewHistory('/')}>
            <img
              src="/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"
              alt="Ghost"
              className="w-6 h-6 animate-ghost-float relative z-10"
            />
          </Link>
        ) : (
          <Link to="/" className="flex items-center justify-center w-full" onClick={() => startNewHistory('/')}>
            <img
              src="/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png"
              alt="Ghost"
              className="w-6 h-6 relative z-10"
            />
          </Link>
        )}
      </header>

      {/* Sidebar Navigation - Main navigation container */}
      <nav
        className="sidebar-nav flex-1 flex flex-col"
        data-element="sidebar-nav"
      >
        {/* Navigation Items List */}
        <ul
          className="nav-items-list px-1 py-1 overflow-y-auto"
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
                  className={cn("group w-full justify-start gap-3 mb-1 hover:bg-accent hover:text-accent-foreground px-2", collapsed ? "justify-center px-1" : "")}
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

          {/* DEV Section with nested subsections */}
          {devSection.adminOnly && !isAdmin ? null : (
            <li className="mt-2 relative group">
              {/* DEV Header */}
              <button
                type="button"
                className={cn(
                  "w-full justify-start gap-3 mb-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center",
                  collapsed ? "justify-center px-2 py-2" : "px-2 py-2"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (collapsed && onToggle) {
                    onToggle();
                  } else if (!collapsed) {
                    toggleSection(devSection.id);
                  }
                }}
              >
                <devSection.icon
                  size={20}
                  className="text-[hsl(var(--warning))] transition-colors"
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{devSection.label}</span>
                    <ChevronRight
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        expandedSections.includes(devSection.id) && "rotate-[60deg]"
                      )}
                    />
                  </>
                )}
              </button>

              {/* DEV Subsections - Expanded Sidebar */}
              {expandedSections.includes(devSection.id) && !collapsed && (
                <ul className="ml-4 mt-1 space-y-1">
                  {devSection.subsections.map((subsection) => {
                    const isSubExpanded = expandedSections.includes(subsection.id);

                    return (
                      <li key={subsection.id}>
                        {/* Subsection Header */}
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSection(subsection.id);
                          }}
                        >
                          <span className="flex-1 text-left">{subsection.label}</span>
                          <ChevronRight
                            size={14}
                            className={cn(
                              "transition-transform duration-200",
                              isSubExpanded && "rotate-[60deg]"
                            )}
                          />
                        </button>

                        {/* Subsection Items */}
                        {isSubExpanded && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {subsection.items.map((item) => (
                              <li key={item.label}>
                                <Button
                                  variant="ghost"
                                  className="group w-full justify-start gap-2 hover:bg-accent/50 hover:text-accent-foreground px-2 py-1 h-auto text-xs"
                                  asChild
                                  onClick={() => startNewHistory(item.path)}
                                >
                                  <Link to={item.path}>
                                    <item.icon size={14} className="transition-colors" />
                                    <span>{item.label}</span>
                                  </Link>
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* DEV Subsections - Collapsed Sidebar (Hover Popover) */}
              {collapsed && (
                <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
                  <div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-2 min-w-[220px]">
                    <div className="px-2 py-1.5 text-sm font-semibold border-b border-border mb-2">
                      {devSection.label}
                    </div>
                    {devSection.subsections.map((subsection) => (
                      <div key={subsection.id} className="mb-3 last:mb-0">
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {subsection.label}
                        </div>
                        <ul className="space-y-0.5 mt-1">
                          {subsection.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.path}
                                onClick={() => startNewHistory(item.path)}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                              >
                                <item.icon size={14} />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          )}
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
        className="sidebar-footer p-4 pb-safe"
        data-element="sidebar-footer"
      >
        {/* Theme Toggle Wrapper */}
        <div
          className="theme-toggle-wrapper flex items-center justify-center"
          data-element="theme-toggle"
        >
          <ThemeToggle className="justify-center" />
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;
