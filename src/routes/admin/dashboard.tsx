import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAdmin } from "@/context/AdminContext";
import { DashboardView } from "@/components/admin/DashboardView";
import { SchemeModal } from "@/components/admin/SchemeModal";
import { CategoryModal } from "@/components/admin/CategoryModal";
import { LocationModal } from "@/components/admin/LocationModal";
import { CompetitorModal } from "@/components/admin/CompetitorModal";
import {
  AdminScheme,
  AdminCategory,
  AdminCompetitor,
} from "@/services/adminStore";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Admin Portal" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const {
    reportsCount,
    schemes,
    setSchemes,
    categories,
    setCategories,
    locations,
    setLocations,
    competitors,
    setCompetitors,
  } = useAdmin();
  const navigate = useNavigate();

  // Quick action modal controls
  const [activeModal, setActiveModal] = useState<
    "scheme" | "category" | "location" | "competitor" | null
  >(null);

  const handleSaveScheme = async (scheme: AdminScheme) => {
    try {
      const updated = await api.createScheme(scheme);
      setSchemes(updated);
      toast.success("Scheme created successfully!", {
        description: `"${scheme.name}" is now live in the directory.`,
      });
    } catch (err: any) {
      toast.error("Failed to save scheme", { description: err?.message });
    }
  };

  const handleSaveCategory = async (category: AdminCategory) => {
    try {
      const updated = await api.createCategory(category);
      setCategories(updated);
      toast.success("Category created successfully!", {
        description: `"${category.name}" added to business categories.`,
      });
    } catch (err: any) {
      toast.error("Failed to save category", { description: err?.message });
    }
  };

  const handleSaveLocation = async (locData: any) => {
    try {
      const updated = await api.createLocation(locData);
      setLocations(updated);
      toast.success("Location added successfully!", {
        description: `${locData.block} (${locData.district}) registered in database.`,
      });
    } catch (err: any) {
      toast.error("Failed to add location", { description: err?.message });
    }
  };

  const handleSaveCompetitor = async (comp: AdminCompetitor) => {
    try {
      const updated = await api.createCompetitor(comp);
      setCompetitors(updated);
      toast.success("Competitor created successfully!", {
        description: `"${comp.name}" added to market benchmark database.`,
      });
    } catch (err: any) {
      toast.error("Failed to save competitor", { description: err?.message });
    }
  };

  return (
    <>
      <DashboardView
        reportsCount={reportsCount}
        schemes={schemes}
        categories={categories}
        locations={locations}
        competitors={competitors}
        onOpenAddScheme={() => setActiveModal("scheme")}
        onOpenAddCategory={() => setActiveModal("category")}
        onOpenAddLocation={() => setActiveModal("location")}
        onOpenAddCompetitor={() => setActiveModal("competitor")}
        onNavigateTab={(tab) => navigate({ to: `/admin/${tab}` })}
      />

      <SchemeModal
        open={activeModal === "scheme"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        scheme={null}
        onSave={handleSaveScheme}
      />

      <CategoryModal
        open={activeModal === "category"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        category={null}
        onSave={handleSaveCategory}
      />

      <LocationModal
        open={activeModal === "location"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        locations={locations}
        onSave={handleSaveLocation}
      />

      <CompetitorModal
        open={activeModal === "competitor"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        competitor={null}
        categories={categories}
        onSave={handleSaveCompetitor}
      />
    </>
  );
}
