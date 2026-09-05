import { useState, useMemo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Building2,
  Briefcase,
  MapPin,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  ArrowLeft,
  ExternalLink,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { isStorageFull } from "@/services/adminStore";

export type AdminTab = "dashboard" | "schemes" | "categories" | "locations" | "competitors";

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  adminEmail: string;
  children: ReactNode;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: typeof Home;
  badge?: string;
  path: string;
}

export function AdminLayout({
  activeTab,
  onTabChange,
  onLogout,
  adminEmail,
  children,
}: AdminLayoutProps) {
  const { t, i18n } = useTranslation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isHindi = i18n.language && i18n.language.startsWith("hi");

  const toggleLanguage = () => {
    const nextLang = isHindi ? "en" : "hi";
    i18n.changeLanguage(nextLang);
  };

  const navItems: NavItem[] = useMemo(
    () => [
      { id: "dashboard", label: t("admin.dashboard"), icon: Home, path: "/admin/dashboard" },
      { id: "schemes", label: t("admin.schemes"), icon: Building2, path: "/admin/schemes" },
      { id: "categories", label: t("admin.categories"), icon: Briefcase, path: "/admin/categories" },
      { id: "locations", label: t("admin.locations"), icon: MapPin, path: "/admin/locations" },
      { id: "competitors", label: t("admin.competitors"), icon: Users, path: "/admin/competitors" },
    ],
    [t],
  );

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-saffron/15 text-saffron">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-foreground">
              PragatiSahayak
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-saffron">
              {t("admin.deck_title")}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-1.5 p-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-saffron text-saffron-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <Link
            to="/"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t("admin.public_site")}</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-60" />
          </Link>

          <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-saffron/10 font-bold text-saffron text-xs">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">{adminEmail}</p>
              <p className="text-[10px] text-muted-foreground">Super Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-card shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-saffron" />
                <span className="font-black text-foreground">PragatiSahayak</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-1.5 p-4 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-saffron text-saffron-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border p-4 space-y-2">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {t("admin.public_site")}
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="w-full text-destructive hover:bg-destructive/10 cursor-pointer text-xs"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> {t("admin.logout")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN LAYOUT CONTENT --- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-foreground sm:text-base">
                {t("admin.portal_title")}
              </span>
              <span className="hidden rounded-full bg-saffron/10 px-2.5 py-0.5 text-[10px] font-bold text-saffron sm:inline-block">
                Portal v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle in Admin Top Bar */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 h-8 rounded-full border border-border bg-card px-2.5 text-xs font-bold text-foreground shadow-2xs hover:border-saffron hover:text-saffron cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-saffron" />
              <span>{isHindi ? "हि | EN" : "EN | हि"}</span>
            </button>

            <span className="hidden text-xs text-muted-foreground sm:inline-block font-mono">
              {adminEmail}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-border text-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer text-xs font-semibold"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> {t("admin.logout")}
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isStorageFull() && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <strong className="font-bold">Browser Storage Warning:</strong> Local browser storage is full. Changes may not persist properly. Please clear old items or export data.
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
