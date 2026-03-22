import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Dashboard } from "./Dashboard";
import { Documents } from "./Documents";
import { Settings } from "./Settings";
import { useAdminStore } from "@/lib/adminStore";
import { NotImplemented } from "../NotImplemented";

export function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeSection } = useAdminStore();

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "documents":
        return <Documents />;
      case "settings":
        return <Settings />;
      default:
        return <NotImplemented />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
}
