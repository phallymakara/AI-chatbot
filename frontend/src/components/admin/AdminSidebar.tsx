import {
  FiGrid,
  FiFileText,
  FiUsers,
  FiSettings,
  FiArrowLeft,
  FiChevronsLeft,
  FiChevronsRight,
  FiActivity,
} from "react-icons/fi";
import { Button } from "../ui/button";
import { useAdminStore } from "@/lib/adminStore";
import { cn } from "@/lib/utils";
import { ProsethLogo } from "@/components/ProsethLogo";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const { activeSection, setActiveSection } = useAdminStore();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid },
    { id: "documents", label: "Document Vault", icon: FiFileText },
    { id: "users", label: "User Audit", icon: FiUsers },
    { id: "settings", label: "System Settings", icon: FiSettings },
  ] as const;

  const handleReturnToChat = () => {
    window.location.hash = "#/chat";
  };

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out h-screen",
        isCollapsed ? "w-16" : "w-56"
      )}>
      {/* Admin Logo Header */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between flex-shrink-0 min-h-[64px]">
        <div className={cn("flex items-center gap-2 overflow-hidden", isCollapsed && "w-0 opacity-0")}>
          <ProsethLogo size="sm" />
          <span className="text-xs font-bold uppercase tracking-tighter text-primary">Admin</span>
        </div>
        <Button
          onClick={onToggleCollapse}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          variant="ghost"
          size="icon">
          {isCollapsed ? <FiChevronsRight className="w-4 h-4" /> : <FiChevronsLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Admin Navigation */}
      <div className="p-2 space-y-0.5 flex-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "w-full gap-3 text-sm h-9 justify-start transition-all duration-200",
              activeSection === item.id ?
                "bg-sidebar-accent text-primary font-medium"
              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
              isCollapsed && "justify-center px-0"
            )}
            variant="ghost"
            title={item.label}>
            <item.icon className={cn("w-4 h-4 shrink-0", activeSection === item.id && "text-primary")} />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        <Button
          onClick={handleReturnToChat}
          className={cn(
            "w-full gap-3 text-sm h-9 justify-start text-muted-foreground hover:text-foreground",
            isCollapsed && "justify-center px-0"
          )}
          variant="ghost"
          title="Return to Chat">
          <FiArrowLeft className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Exit Admin</span>}
        </Button>

        <div className={cn("px-3 py-2 flex items-center justify-between", isCollapsed && "hidden")}>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/50">Status</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
              <FiActivity className="w-3 h-3" /> System Healthy
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
