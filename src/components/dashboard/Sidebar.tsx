import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Car,
  Cog,
  CircleDot,
  Gauge,
  Palette,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  UserCircle2,
  UserPlus
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { useDevMode } from "@/contexts/DevModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBackendTarget } from "@/contexts/BackendTargetContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { buildCollectionNavPathWithGlobalBrand } from "@/lib/collectionSearchPersistence";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { user, actualUser, isAuthenticated, actualIsAuthenticated, isAdmin, signOut } = useAuth();
  const { startNewHistory } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDevMode, perspective, setPerspective, canUsePerspectiveSwitcher } = useDevMode();
  const { selectedTarget, activeTarget, setSelectedTarget, canUseWorkshop, workshopConfigured } = useBackendTarget();
  const showAdminUi = isAdmin && isDevMode;
  const accountTriggerRef = useRef<HTMLButtonElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      onHoverChange?.(next);
      return next;
    });
  };

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        accountMenuRef.current?.contains(target) ||
        accountTriggerRef.current?.contains(target)
      ) {
        return;
      }
      setIsAccountMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

  const navigationItems = [
    { icon: Building2, label: "Brands", path: "/brands", adminOnly: false },
    { icon: Car, label: "Vehicles", path: "/vehicles", adminOnly: false },
    { icon: Cog, label: "Builds", path: "/builds", adminOnly: false },
    { icon: CircleDot, label: "Wheels", path: "/wheels", adminOnly: false },
    { icon: Palette, label: "Colors", path: "/colors", adminOnly: false },
    { icon: Gauge, label: "Engines", path: "/engines", adminOnly: false },
    { icon: LayoutDashboard, label: "Dev", path: "/dev", adminOnly: true },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const accountUser = actualUser ?? user;
  const accountName = accountUser?.fullName
    || accountUser?.name
    || accountUser?.username
    || accountUser?.email?.split("@")[0]
    || accountUser?.emailAddresses?.[0]?.emailAddress?.split("@")[0]
    || "Guest";
  const accountEmail = accountUser?.email || accountUser?.emailAddresses?.[0]?.emailAddress || "Browse in guest mode";
  const accountImage = actualIsAuthenticated
    ? accountUser?.imageUrl || accountUser?.profileImage
    : "/lovable-uploads/af8ef8ef-5e23-4161-a1c6-65e3628660d5.png";
  const accountInitials = accountName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("") || "G";
  const isLocalAdminMode = actualIsAuthenticated && isAdmin && isDevMode && activeTarget === "workshop";
  const avatarRingClass = isLocalAdminMode
    ? "ring-2 ring-orange-500/80 shadow-[0_0_14px_rgba(249,115,22,0.42)]"
    : "ring-2 ring-border/60";
  const accountStatusClass = isLocalAdminMode
    ? "bg-orange-500"
    : actualIsAuthenticated
      ? "bg-emerald-500"
      : "bg-red-500";

  const accountTrigger = (
    <div
      className={cn(
        "flex items-center gap-3 w-full p-2 rounded-full hover:bg-white/10 transition-colors",
        !isExpanded && "justify-center"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className={cn("h-8 w-8", avatarRingClass)}>
          <AvatarImage src={accountImage} alt={accountName} />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
            {accountInitials}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-sidebar",
            accountStatusClass
          )}
        />
      </div>
      {isExpanded && (
        <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
          <span className="text-sm font-semibold truncate leading-none">
            {actualIsAuthenticated ? accountName : "Account"}
          </span>
          <span className="text-[10px] text-muted-foreground truncate leading-none mt-1">
            {actualIsAuthenticated ? (showAdminUi ? "Administrator" : "Member") : "Sign in or create account"}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col z-50 h-full transition-all duration-300 ease-in-out",
          isExpanded ? "w-[200px]" : "w-[60px]",
          className
        )}
        onClick={toggleSidebar}
      >
        {/* Logo / Profile */}
        <div className="h-12 flex items-center px-2 mb-2 shrink-0">
          <button
            ref={accountTriggerRef}
            type="button"
            className="w-full rounded-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            onClick={(event) => {
              event.stopPropagation();
              setIsAccountMenuOpen((prev) => !prev);
            }}
          >
            {accountTrigger}
          </button>
          {isAccountMenuOpen ? (
            <div
              ref={accountMenuRef}
              className="absolute top-2 left-[calc(100%+16px)] z-[60] w-[272px] rounded-2xl border border-border bg-sidebar p-0 text-foreground shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-left-2 duration-200"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className={cn("h-10 w-10", avatarRingClass)}>
                    <AvatarImage src={accountImage} alt={accountName} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                      {accountInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-base font-semibold">
                      {actualIsAuthenticated ? accountName : "Welcome"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{accountEmail}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {actualIsAuthenticated && canUsePerspectiveSwitcher ? (
                    <div className="flex items-center gap-1 rounded-full p-0.5 bg-white/5 border border-white/10 w-full">
                      {(["basic", "user", "dev"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPerspective(p);
                          }}
                          className={cn(
                            "flex-1 rounded-full px-2 py-1 text-[11px] font-medium transition-all duration-200",
                            p === "basic" && [
                              "text-zinc-400",
                              perspective === "basic"
                                ? "bg-zinc-500/80 text-white shadow-[0_0_8px_rgba(113,113,122,0.4)]"
                                : "hover:bg-zinc-500/30 hover:text-zinc-200",
                            ],
                            p === "user" && [
                              "text-sky-400",
                              perspective === "user"
                                ? "bg-sky-500/90 text-white shadow-[0_0_8px_rgba(14,165,233,0.4)]"
                                : "hover:bg-sky-500/30 hover:text-sky-200",
                            ],
                            p === "dev" && [
                              "text-amber-400",
                              perspective === "dev"
                                ? "bg-amber-500/90 text-white shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                : "hover:bg-amber-500/30 hover:text-amber-200",
                            ]
                          )}
                        >
                          {p === "basic" ? "Basic" : p === "user" ? "User" : "Dev"}
                        </button>
                      ))}
                    </div>
                  ) : null}
                {!canUsePerspectiveSwitcher ? (
                    <>
                      <div className={cn(
                        "rounded-full border px-3 py-1 text-[11px] font-medium",
                        actualIsAuthenticated
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-700 bg-zinc-900 text-zinc-400"
                      )}>
                        {actualIsAuthenticated ? "Signed in" : "Guest"}
                      </div>
                      {actualIsAuthenticated ? (
                        <div className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-medium",
                          showAdminUi
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                            : "border-sky-500/20 bg-sky-500/10 text-sky-300"
                        )}>
                          {showAdminUi ? "Admin" : "Member"}
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>

                {showAdminUi ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-1 rounded-full p-0.5 bg-white/5 border border-white/10 w-full">
                      {(["control", "workshop"] as const).map((target) => {
                        const isWorkshop = target === "workshop";
                        const disabled = isWorkshop && !canUseWorkshop;
                        return (
                          <button
                            key={target}
                            type="button"
                            disabled={disabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTarget(target);
                            }}
                            className={cn(
                              "flex-1 rounded-full px-2 py-1 text-[11px] font-medium transition-all duration-200",
                              target === "control" && [
                                "text-sky-300",
                                selectedTarget === "control"
                                  ? "bg-sky-500/90 text-white shadow-[0_0_8px_rgba(14,165,233,0.35)]"
                                  : "hover:bg-sky-500/20 hover:text-sky-100",
                              ],
                              target === "workshop" && [
                                "text-red-300",
                                selectedTarget === "workshop"
                                  ? "bg-red-500/90 text-white shadow-[0_0_10px_rgba(239,68,68,0.45)]"
                                  : "hover:bg-red-500/20 hover:text-red-100",
                              ],
                              disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-red-300"
                            )}
                            title={
                              disabled
                                ? workshopConfigured
                                  ? "Local is only available to admins."
                                  : "Set VITE_CONVEX_WORKSHOP_URL or VITE_CONVEX_LOCAL_URL to enable Local."
                                : undefined
                            }
                          >
                            {target === "control" ? "Cloud" : "Local"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              <Separator />

              {actualIsAuthenticated ? (
                <div className="p-2 space-y-1">
                  {showAdminUi ? (
                    <Link
                      to="/dev"
                      state={{ resetNavigation: true }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10 text-amber-500/90 hover:text-amber-400"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsAccountMenuOpen(false);
                        startNewHistory("/dev");
                      }}
                    >
                      <LayoutDashboard size={18} className="shrink-0" />
                      <span>Admin dashboard</span>
                    </Link>
                  ) : null}
                  <Link
                    to="/account"
                    state={{ resetNavigation: true }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsAccountMenuOpen(false);
                      startNewHistory("/account");
                    }}
                  >
                    <Settings size={18} className="text-muted-foreground" />
                    <span>Manage account</span>
                  </Link>
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      void signOut();
                    }}
                  >
                    <LogOut size={18} className="text-muted-foreground" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Sign in to save items, comment, and use your account features.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="rounded-2xl"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        navigate("/login");
                      }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl border-white/10 bg-transparent text-zinc-100 hover:bg-white/5 hover:text-zinc-100"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        navigate("/login?tab=register");
                      }}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex-1 flex flex-col px-2 gap-1 overflow-hidden">
          {navigationItems.map((item) => {
            if (item.adminOnly && !showAdminUi) return null;
            const active = isActive(item.path);
            const navPath = buildCollectionNavPathWithGlobalBrand(item.path, location.search);

            const LinkContent = (
              <Link
                to={navPath}
                state={{ resetNavigation: true }}
                className={cn(
                  "flex items-center gap-3 h-10 px-4 rounded-full text-sm transition-all duration-200 relative group",
                  active
                    ? "bg-white text-black shadow-sm font-medium"
                    : "text-muted-foreground hover:bg-white/10 hover:text-foreground",
                  item.adminOnly && !active && "text-amber-500/80 hover:text-amber-500",
                  !isExpanded && "justify-center",
                  className
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  startNewHistory(navPath);
                }}
              >
                <item.icon size={20} className={cn("shrink-0 transition-transform duration-200", active && "scale-105")} />

                {isExpanded && (
                  <span className="truncate animate-in fade-in slide-in-from-left-1 duration-200">
                    {item.label}
                  </span>
                )}

                {/* Active Indicator Dot for Compact Mode */}
                {!isExpanded && active && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-black/80 dark:bg-white/80" />
                )}
              </Link>
            );

            if (!isExpanded) {
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

      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
