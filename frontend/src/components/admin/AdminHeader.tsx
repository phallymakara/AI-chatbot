import { MessageSquare } from "lucide-react";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { Button } from "../ui/button";
import { useTheme } from "../theme-provider";
import { useMsal } from "@azure/msal-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { instance } = useMsal();

  const handleSwitchToChat = () => {
    window.location.hash = "#/chat";
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      instance.logoutRedirect();
    }
  };

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-medium text-primary uppercase whitespace-nowrap">Live System</span>
          </div>
          
          <div className="w-px h-3 bg-primary/20" />
          
          <button
            onClick={handleSwitchToChat}
            className="flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors cursor-pointer group"
            title="Switch to Chat"
          >
            <MessageSquare className="h-3 w-3 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Switch to Chat</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 border-l border-border/50 pl-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-muted-foreground hover:text-foreground">
            {theme === "dark" ?
              <FiSun className="h-4 w-4" />
            : <FiMoon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:text-destructive transition-colors">
            <FiLogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
