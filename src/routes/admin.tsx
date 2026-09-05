import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { AdminLayout, AdminTab } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { getAdminSession } from "@/services/adminStore";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — PragatiSahayak" },
      { name: "description", content: "PragatiSahayak administrative controls & dataset management." },
      { property: "og:title", content: "Admin Portal — PragatiSahayak" },
      { property: "og:description", content: "PragatiSahayak administrative controls & dataset management." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayoutContainer,
});

function AdminLayoutContainer() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}

function AdminContent() {
  const { session, setSession, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from current pathname
  const currentPath = location.pathname;
  let activeTab: AdminTab = "dashboard";
  if (currentPath.includes("/schemes")) {
    activeTab = "schemes";
  } else if (currentPath.includes("/categories")) {
    activeTab = "categories";
  } else if (currentPath.includes("/locations")) {
    activeTab = "locations";
  } else if (currentPath.includes("/competitors")) {
    activeTab = "competitors";
  } else {
    activeTab = "dashboard";
  }

  // If unauthenticated, show login screen
  if (!session || !session.isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AdminLogin
          onSuccess={() => {
            setSession(getAdminSession());
            navigate({ to: "/admin/dashboard" });
          }}
        />
      </div>
    );
  }

  const handleTabChange = (tab: AdminTab) => {
    navigate({ to: `/admin/${tab}` });
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out", {
      description: "Admin session ended securely.",
    });
    navigate({ to: "/admin" });
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      adminEmail={session.email || "admin@pragatisahayak.in"}
    >
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-saffron" />
              <p className="text-xs font-semibold text-muted-foreground">
                Loading administrative dataset...
              </p>
            </div>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </AdminLayout>
  );
}
