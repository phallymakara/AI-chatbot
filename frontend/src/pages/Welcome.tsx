import {
  FiSearch,
  FiArrowRight,
  FiSun,
  FiMoon,
  FiZap,
  FiBookOpen,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import { useChatStore } from "@/lib/store";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ProsethLogo } from "@/components/ProsethLogo";
import { Footer } from "@/components/Footer";
import { useMsal } from "@azure/msal-react";

export function Welcome() {
  const { createConversation } = useChatStore();
  const { theme, toggleTheme } = useTheme();
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  const roles = (account?.idTokenClaims as any)?.roles || [];
  const isAdmin = roles.includes("SystemAdmin") || roles.includes("TenantAdmin");

  const handleStartChat = () => {
    createConversation();
    window.location.hash = "#/chat";
  };

  const handleSwitchToAdmin = () => {
    window.location.hash = "#/admin/dashboard";
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      const account = instance.getActiveAccount();
      console.log("\n" + "=".repeat(40));
      console.log("🔴 USER LOGGING OUT");
      console.log("User:", account?.username);
      console.log("=".repeat(40) + "\n");
      instance.logoutRedirect();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Minimal Navbar */}
      <header className="absolute top-0 w-full z-10 p-4 sm:p-6 flex justify-between items-center bg-background/50 backdrop-blur-sm border-b border-border/50">
        <ProsethLogo size="lg" />
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchToAdmin}
              className="hidden sm:flex items-center gap-2 h-9 px-4 text-xs font-bold border-primary/20 hover:bg-primary/5 text-primary transition-all">
              <FiShield className="w-4 h-4" />
              Admin Dashboard
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-muted-foreground hover:text-foreground">
            {theme === "dark" ?
              <FiSun className="w-5 h-5" />
            : <FiMoon className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:text-destructive transition-colors">
            <FiLogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-24 sm:p-8 animate-in fade-in duration-700">
        <div className="w-full max-w-2xl space-y-8 text-center flex flex-col items-center">
          {/* Animated Central Icon */}
          <div className="mb-4 relative group cursor-default">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* <ProsethLogo size="xl" /> */}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl text-foreground font-medium tracking-tight mb-8 font-sans">
            welcome to proseth chat-bot
          </h1>

          {/* Fake Search Input (Click to Start) */}
          <div
            onClick={handleStartChat}
            className="group relative w-full cursor-text">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <FiSearch className="h-5 w-5 text-muted-foreground/70" />
            </div>

            <div className="w-full h-16 sm:h-20 bg-card hover:bg-card/80 border-2 border-primary/20 hover:border-primary/40 rounded-full shadow-[0_4px_20px_rgba(32,128,141,0.15)] hover:shadow-[0_4px_25px_rgba(32,128,141,0.25)] transition-all duration-300 flex items-center px-12 text-lg text-muted-foreground relative overflow-hidden">
              Ask anything...
            </div>

            <div className="absolute inset-y-0 right-3 flex items-center z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted/50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <FiArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Suggestions / Pill Links */}
          <div className="flex flex-wrap justify-center gap-3 pt-2 opacity-70">
            {[
              "Atendance Policy",
              "Uniform Policy",
              "Annual leave",
              "Sick Leave",
            ].map((topic) => (
              <button
                key={topic}
                onClick={handleStartChat}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-border/60 hover:border-primary/50 bg-card/30 hover:bg-card transition-colors">
                {topic}
              </button>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-12 pt-8 border-t border-border/40">
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FiZap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-1">
                Qurey from Document
              </h3>
              <p className="text-xs text-muted-foreground">
                Real-time answers from the Document.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FiBookOpen className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-1">
                Citations Included
              </h3>
              <p className="text-xs text-muted-foreground">
                Trustworthy sources for every claim.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FiShield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-1">
                Private & Secure
              </h3>
              <p className="text-xs text-muted-foreground">
                Your data stays with you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
