import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  AdminScheme,
  AdminCategory,
  LocationTree,
  AdminCompetitor,
  AdminSession,
  getAdminSession,
  clearAdminSession,
  getAdminSchemes,
  getAdminCategories,
  getAdminLocations,
  getAdminCompetitors,
  getReportsGeneratedCount,
} from "@/services/adminStore";
import { AdminTab } from "@/components/admin/AdminLayout";
import { api } from "@/services/api";

interface AdminContextType {
  session: AdminSession | null;
  setSession: (session: AdminSession | null) => void;
  logout: () => void;
  schemes: AdminScheme[];
  setSchemes: (schemes: AdminScheme[]) => void;
  categories: AdminCategory[];
  setCategories: (categories: AdminCategory[]) => void;
  locations: LocationTree;
  setLocations: (locations: LocationTree) => void;
  competitors: AdminCompetitor[];
  setCompetitors: (competitors: AdminCompetitor[]) => void;
  reportsCount: number;
  setReportsCount: (count: number) => void;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  quickModal: "scheme" | "category" | "location" | "competitor" | null;
  setQuickModal: (modal: "scheme" | "category" | "location" | "competitor" | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [schemes, setSchemes] = useState<AdminScheme[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [locations, setLocations] = useState<LocationTree>({});
  const [competitors, setCompetitors] = useState<AdminCompetitor[]>([]);
  const [reportsCount, setReportsCount] = useState<number>(34);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [quickModal, setQuickModal] = useState<"scheme" | "category" | "location" | "competitor" | null>(null);

  // Initialize admin state via Unified API service layer
  useEffect(() => {
    setSession(getAdminSession());
    api.getSchemesAdmin().then(setSchemes);
    api.getCategoriesAdmin().then(setCategories);
    api.getLocationsAdmin().then(setLocations);
    api.getCompetitorsAdmin().then(setCompetitors);
    setReportsCount(getReportsGeneratedCount());
  }, []);

  const logout = () => {
    clearAdminSession();
    setSession(null);
  };

  return (
    <AdminContext.Provider
      value={{
        session,
        setSession,
        logout,
        schemes,
        setSchemes,
        categories,
        setCategories,
        locations,
        setLocations,
        competitors,
        setCompetitors,
        reportsCount,
        setReportsCount,
        activeTab,
        setActiveTab,
        quickModal,
        setQuickModal,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
