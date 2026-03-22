import { useEffect, useState, useCallback } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Chat } from "./pages/Chat";
import { Welcome } from "./pages/Welcome";
import { NotImplemented } from "./pages/NotImplemented";
import { AdminLayout } from "./pages/admin/AdminLayout";

function App() {
  const [currentPath, setCurrentPath] = useState(
    window.location.hash || "#/welcome",
  );

  const [isReady, setIsReady] = useState(true);

  // 🔄 Router
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || "#/welcome");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 🔐 MOCK LOGIN FOR TESTING
  const account = {
    username: "test@example.com",
    name: "Test User",
    idTokenClaims: {
      roles: ["SystemAdmin", "TenantAdmin"],
    },
  };
  const isAdmin = true;

  useEffect(() => {
    if (isAdmin && (currentPath === "#/welcome" || currentPath === "" || currentPath === "#/")) {
      console.log("Redirecting Admin to Dashboard...");
      window.location.hash = "#/admin/dashboard";
    }
  }, [isAdmin, currentPath]);

  const callApi = useCallback(async () => {
    try {
      console.log("Sending request to backend (auth bypassed)...");
      const res = await fetch("http://localhost:8000/api/test", {
        headers: {
          Authorization: `Bearer mock-token`,
        },
      });

      const data = await res.json();
      console.log("Backend Response:", data);
    } catch (error) {
      console.error("API Call Error:", error);
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      callApi();
    }
  }, [isReady, callApi]);

  // ⏳ WAIT until ready
  if (!isReady) {
    return <div>Loading...</div>;
  }

  // ✅ LOGGED IN UI (ALWAYS LOGGED IN FOR TESTING)

  if (currentPath === "#/chat") {
    return (
      <ThemeProvider>
        <Chat />
      </ThemeProvider>
    );
  }

  if (currentPath.startsWith("#/admin")) {
    return (
      <ThemeProvider>
        <AdminLayout />
      </ThemeProvider>
    );
  }

  if (currentPath === "#/not-implemented") {
    return (
      <ThemeProvider>
        <NotImplemented />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Welcome />
    </ThemeProvider>
  );
}

export default App;
