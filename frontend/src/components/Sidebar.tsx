import {
  FiPlus,
  FiMessageSquare,
  FiTrash2,
  FiHome,
  FiChevronsLeft,
  FiChevronsRight,
  FiSettings,
  FiSmartphone,
  FiEdit2,
  FiCheck,
  FiX,
  FiShield,
} from "react-icons/fi";
import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";
// import logo from "../assets/proseth.svg";
import { ProsethLogo } from "@/components/ProsethLogo";
// import { Input } from "./ui/input";
import { useMsal } from "@azure/msal-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  isDesktopCollapsed?: boolean;
  onMobileClose?: () => void;
  onDesktopToggle?: () => void;
}

export function Sidebar({
  isMobileOpen = false,
  isDesktopCollapsed = false,
  onMobileClose,
  onDesktopToggle,
}: SidebarProps) {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  const roles = (account?.idTokenClaims as any)?.roles || [];
  const isAdmin = roles.includes("SystemAdmin") || roles.includes("TenantAdmin");

  const {
    conversations,
    activeConversationId,
    createConversation,
    setActiveConversation,
    deleteConversation,
    updateConversationTitle,
  } = useChatStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleNewChat = () => {
    createConversation();
    onMobileClose?.();
  };

  const handleSelectConversation = (id: string) => {
    if (editingId) return; // Don't switch if editing
    setActiveConversation(id);
    onMobileClose?.();
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteConversation(id);
    }
  };

  const handleStartRename = (
    id: string,
    title: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveRename = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (editingId && editTitle.trim()) {
      updateConversationTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEditingId(null);
  };

  const handleNavigation = (hash: string) => {
    window.location.hash = hash;
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          isDesktopCollapsed ? "md:w-16" : "md:w-60",
          "w-64",
        )}>
        {/* Logo & Collapse Toggle */}
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between flex-shrink-0 min-h-[64px]">
          <div
            className={cn(
              "flex items-center transition-all duration-200",
              isDesktopCollapsed ?
                "md:opacity-0 md:w-0 overflow-hidden"
              : "md:opacity-100",
            )}>
            <ProsethLogo size="md" />
          </div>

          <Button
            onClick={onDesktopToggle}
            className="hidden md:flex h-8 w-8 text-black dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            variant="ghost"
            size="icon"
            title={isDesktopCollapsed ? "Expand" : "Collapse"}>
            {isDesktopCollapsed ?
              <FiChevronsRight className="w-4 h-4" />
            : <FiChevronsLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="p-2 space-y-1 flex-shrink-0">
          <Button
            onClick={handleNewChat}
            className={cn(
              "w-full gap-3 text-sm h-10 justify-start bg-sidebar-border/50 hover:bg-sidebar-border text-foreground border border-sidebar-border mb-2 rounded-full",
              isDesktopCollapsed &&
                "md:justify-center md:px-0 md:w-10 md:h-10 md:rounded-lg",
            )}
            variant="ghost"
            title="New Chat">
            <FiPlus className="w-4 h-4 flex-shrink-0" />
            <span className={cn(isDesktopCollapsed && "md:hidden", "truncate")}>
              New Chat
            </span>
          </Button>

          <Button
            onClick={() => handleNavigation("#/")}
            className={cn(
              "w-full gap-3 text-sm h-9 justify-start text-muted-foreground hover:text-foreground",
              isDesktopCollapsed && "md:justify-center md:px-0",
            )}
            variant="ghost"
            title="Home">
            <FiHome className="w-4 h-4 flex-shrink-0" />
            <span className={cn(isDesktopCollapsed && "md:hidden", "truncate")}>
              Home
            </span>
          </Button>
        </div>

        {/* Thread History */}
        <div
          className={cn(
            "flex-1 flex flex-col min-h-0 mt-2",
            isDesktopCollapsed && "md:hidden",
          )}>
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider flex-shrink-0">
            Recent History
          </div>

          <ScrollArea className="flex-1 min-h-0 px-2">
            <div className="space-y-1 pb-4">
              {conversations.length === 0 ?
                <div className="px-3 py-6 text-center text-sm text-muted-foreground/50">
                  No history yet
                </div>
              : conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={cn(
                      "group flex items-center w-full gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
                      activeConversationId === conversation.id ?
                        "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}>
                    <FiMessageSquare className="w-4 h-4 shrink-0" />

                    {editingId === conversation.id ?
                      <form
                        onSubmit={handleSaveRename}
                        className="flex-1 flex items-center gap-1 min-w-0"
                        onClick={(e) => e.stopPropagation()}>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 h-7 text-xs py-0 px-2 bg-background border border-primary/30 rounded focus:outline-none focus:ring-1 focus:ring-primary/20 block min-w-0"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(e);
                            if (e.key === "Escape") handleCancelRename(e);
                          }}
                          onBlur={() => handleSaveRename()}
                        />
                        <button
                          type="submit"
                          className="p-1 text-primary hover:text-primary/80 shrink-0"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <FiCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelRename}
                          onMouseDown={(e) => e.preventDefault()}
                          className="p-1 text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    : <>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <span className="block truncate select-none text-[13px]">
                            {conversation.title}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 ml-auto">
                          <button
                            className={cn(
                              "p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-all",
                              activeConversationId === conversation.id ?
                                "opacity-100"
                              : "opacity-0 group-hover:opacity-100",
                            )}
                            onClick={(e) =>
                              handleStartRename(
                                conversation.id,
                                conversation.title,
                                e,
                              )
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                            title="Rename">
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className={cn(
                              "p-1 rounded hover:bg-rose-500/10 hover:text-destructive transition-all",
                              activeConversationId === conversation.id ?
                                "opacity-100"
                              : "opacity-0 group-hover:opacity-100",
                            )}
                            onClick={(e) =>
                              handleDeleteConversation(conversation.id, e)
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                            title="Delete">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    }
                  </div>
                ))
              }
            </div>
          </ScrollArea>
        </div>

        {/* Bottom Section (Footer) */}
        <div className="p-2 border-t border-sidebar-border mt-auto flex-shrink-0 space-y-1">
          {isAdmin && (
            <Button
              onClick={() => handleNavigation("#/admin/dashboard")}
              className={cn(
                "w-full gap-3 text-sm h-9 justify-start text-primary hover:bg-primary/10",
                isDesktopCollapsed && "md:justify-center md:px-0",
              )}
              variant="ghost"
              title="Admin Panel">
              <FiShield className="w-4 h-4 flex-shrink-0" />
              <span className={cn(isDesktopCollapsed && "md:hidden", "truncate font-bold")}>
                Admin Panel
              </span>
            </Button>
          )}

          <Button
            onClick={() => handleNavigation("#/not-implemented")}
            className={cn(
              "w-full gap-3 text-sm h-9 justify-start text-muted-foreground hover:text-foreground",
              isDesktopCollapsed && "md:justify-center md:px-0",
            )}
            variant="ghost"
            title="Document">
            <FiSmartphone className="w-4 h-4 flex-shrink-0" />
            <span className={cn(isDesktopCollapsed && "md:hidden", "truncate")}>
              Document
            </span>
          </Button>

          <div
            className={cn(
              "hidden md:block transition-all",
              isDesktopCollapsed && "hidden",
            )}>
            <div className="h-px bg-sidebar-border my-1 mx-2"></div>
          </div>

          <Button
            onClick={() => handleNavigation("#/not-implemented")}
            className={cn(
              "w-full gap-3 text-sm h-9 justify-start text-muted-foreground hover:text-foreground",
              isDesktopCollapsed && "md:justify-center md:px-0",
            )}
            variant="ghost"
            title="Settings">
            <FiSettings className="w-4 h-4 flex-shrink-0" />
            <span className={cn(isDesktopCollapsed && "md:hidden", "truncate")}>
              Settings
            </span>
          </Button>

          <div
            className={cn(
              "flex items-center justify-between px-2 py-2 mt-1",
              isDesktopCollapsed && "hidden",
            )}>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">
                Premium
              </span>
              <span className="text-[10px] text-muted-foreground">Plan</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
