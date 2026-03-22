import { FiMenu, FiMoon, FiSun, FiSidebar, FiLogOut, FiShield } from "react-icons/fi";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { useMsal } from "@azure/msal-react";
import logo from "../assets/proseth.svg";

interface HeaderProps {
  onMenuClick?: () => void;
  onDesktopToggle?: () => void;
  isDesktopSidebarCollapsed?: boolean;
}

export function Header({
  onMenuClick,
  onDesktopToggle,
  isDesktopSidebarCollapsed,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  const roles = (account?.idTokenClaims as any)?.roles || [];
  const isAdmin = roles.includes("SystemAdmin") || roles.includes("TenantAdmin");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      instance.logoutRedirect();
    }
  };

  const handleSwitchToAdmin = () => {
    window.location.hash = "#/admin/dashboard";
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
        {/* Left: Menu Button (Mobile) & Desktop Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 sm:h-9 sm:w-9"
            onClick={onMenuClick}>
            <FiMenu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Desktop sidebar toggle - only visible when sidebar is collapsed */}
          {isDesktopSidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-8 w-8 sm:h-9 sm:w-9"
              onClick={onDesktopToggle}
              title="Expand sidebar">
              <FiSidebar className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}

          {/* Proseth Logo - only show on mobile or when sidebar collapsed */}
          <div className={`${!isDesktopSidebarCollapsed ? "md:hidden" : ""}`}>
            <img src={logo} alt="Logo" className="h-20 sm:h-35 w-auto" />
          </div>
        </div>

        {/* Right: Theme Toggle & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchToAdmin}
              className="hidden sm:flex items-center gap-2 h-8 px-3 text-xs font-bold border-primary/20 hover:bg-primary/5 text-primary hover:text-primary transition-all">
              <FiShield className="w-3.5 h-3.5" />
              Admin Panel
            </Button>
          )}

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-medium text-primary uppercase whitespace-nowrap">Live System</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground">
              {theme === "dark" ?
                <FiSun className="h-4 w-4 sm:h-5 sm:w-5" />
              : <FiMoon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
              className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground hover:text-destructive transition-colors">
              <FiLogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
